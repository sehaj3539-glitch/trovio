import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.resolve(__dirname, 'db.json')

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8')
      return JSON.parse(content)
    }
  } catch (err) {
    console.error('Error reading db.json:', err)
  }
  return { items: [] }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('Error writing db.json:', err)
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      if (!body) return resolve({})
      try {
        resolve(JSON.parse(body))
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

// Custom Mock REST API Plugin for Trovio Front End Engineering evaluation
function mockRestApiPlugin() {
  return {
    name: 'mock-rest-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Only intercept /api/items endpoints
        if (!req.url || !req.url.startsWith('/api/items')) {
          return next()
        }

        // Set standard CORS & JSON headers
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          return res.end()
        }

        const urlObj = new URL(req.url, 'http://localhost')
        const pathname = urlObj.pathname.replace(/\/$/, '')
        const segments = pathname.split('/').filter(Boolean) // ['api', 'items', ...]
        const itemId = segments[2] || null

        const db = readDb()
        let items = db.items || []

        try {
          // GET /api/items or GET /api/items/:id
          if (req.method === 'GET') {
            if (itemId) {
              const item = items.find(i => String(i.id) === String(itemId))
              if (item) {
                res.statusCode = 200
                return res.end(JSON.stringify(item))
              } else {
                res.statusCode = 404
                return res.end(JSON.stringify({ error: `Item with id ${itemId} not found` }))
              }
            } else {
              // Filtering & searching support for evaluation
              const statusQuery = urlObj.searchParams.get('status')
              const searchQuery = urlObj.searchParams.get('q')

              let filtered = [...items]
              if (statusQuery) {
                const sq = statusQuery.toLowerCase()
                filtered = filtered.filter(i => 
                  (i.status && i.status.toLowerCase() === sq) ||
                  (i.type && i.type.toLowerCase() === sq)
                )
              }
              if (searchQuery) {
                const q = searchQuery.toLowerCase()
                filtered = filtered.filter(i => 
                  (i.itemName && i.itemName.toLowerCase().includes(q)) ||
                  (i.title && i.title.toLowerCase().includes(q)) ||
                  (i.location && i.location.toLowerCase().includes(q)) ||
                  (i.description && i.description.toLowerCase().includes(q))
                )
              }

              res.statusCode = 200
              return res.end(JSON.stringify(filtered))
            }
          }

          // POST /api/items
          if (req.method === 'POST') {
            const body = await parseBody(req)
            const newItem = {
              id: body.id || `item_${Date.now()}`,
              itemName: body.itemName || body.title || 'Untitled Item',
              title: body.title || body.itemName || 'Untitled Item',
              description: body.description || '',
              category: body.category || 'General',
              location: body.location || 'Campus Grounds',
              date: body.date || new Date().toISOString().split('T')[0],
              status: body.status || (body.type === 'found' ? 'Found' : 'Lost'),
              type: body.type || (body.status?.toLowerCase() === 'found' ? 'found' : 'lost'),
              itemStatus: body.itemStatus || 'active',
              image: body.image || '',
              reportedBy: body.reportedBy || body.contact?.name || 'Campus Student',
              ownerId: body.ownerId || `user_${Date.now()}`,
              contact: body.contact || {
                name: body.reportedBy || 'Campus Student',
                email: body.email || '',
                phone: body.phone || '',
                preferredMethod: 'Phone / WhatsApp'
              },
              createdAt: new Date().toISOString()
            }

            items.unshift(newItem)
            writeDb({ items })
            res.statusCode = 201
            return res.end(JSON.stringify(newItem))
          }

          // PUT or PATCH /api/items/:id
          if (req.method === 'PUT' || req.method === 'PATCH') {
            if (!itemId) {
              res.statusCode = 400
              return res.end(JSON.stringify({ error: 'Missing item ID for update' }))
            }
            const body = await parseBody(req)
            const index = items.findIndex(i => String(i.id) === String(itemId))
            if (index === -1) {
              res.statusCode = 404
              return res.end(JSON.stringify({ error: `Item with id ${itemId} not found` }))
            }

            const updatedItem = {
              ...items[index],
              ...body,
              title: body.title || body.itemName || items[index].title,
              itemName: body.itemName || body.title || items[index].itemName
            }
            items[index] = updatedItem
            writeDb({ items })
            res.statusCode = 200
            return res.end(JSON.stringify(updatedItem))
          }

          // DELETE /api/items/:id
          if (req.method === 'DELETE') {
            if (!itemId) {
              res.statusCode = 400
              return res.end(JSON.stringify({ error: 'Missing item ID for delete' }))
            }
            const exists = items.some(i => String(i.id) === String(itemId))
            if (!exists) {
              res.statusCode = 404
              return res.end(JSON.stringify({ error: `Item with id ${itemId} not found` }))
            }
            items = items.filter(i => String(i.id) !== String(itemId))
            writeDb({ items })
            res.statusCode = 200
            return res.end(JSON.stringify({ success: true, id: itemId }))
          }

          res.statusCode = 405
          return res.end(JSON.stringify({ error: 'Method not allowed' }))
        } catch (error) {
          console.error('API Error:', error)
          res.statusCode = 500
          return res.end(JSON.stringify({ error: 'Internal server error', details: error.message }))
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockRestApiPlugin()],
})
