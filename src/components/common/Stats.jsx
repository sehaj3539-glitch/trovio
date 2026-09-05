import React from 'react';
import { CheckCircle, Search, HelpCircle, TrendingUp } from 'lucide-react';
import { useItems } from '../../context/ItemContext';

/**
 * Stats Component
 * Displays live, reactive statistics derived from ItemContext state.
 * Uses semantic <section> and metric cards to showcase system activity.
 */
export default function Stats() {
  const { stats } = useItems();

  const statItems = [
    {
      label: 'Campus Reports',
      value: stats.total,
      sublabel: 'Total reported to date',
      icon: HelpCircle,
      color: 'stat-blue'
    },
    {
      label: 'Items Reunited',
      value: stats.resolvedCount,
      sublabel: 'Successfully recovered',
      icon: CheckCircle,
      color: 'stat-green'
    },
    {
      label: 'Active Inquiries',
      value: stats.activeCount,
      sublabel: 'Currently ongoing searches',
      icon: Search,
      color: 'stat-amber'
    },
    {
      label: 'Recovery Rate',
      value: `${stats.successRate}%`,
      sublabel: 'Trovio network efficiency',
      icon: TrendingUp,
      color: 'stat-purple'
    }
  ];

  return (
    <section className="stats-section" aria-label="Campus Statistics">
      <div className="stats-grid">
        {statItems.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className={`stat-card ${stat.color}`}>
              <div className="stat-icon-wrapper">
                <IconComponent size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{stat.value}</span>
                <h4 className="stat-label">{stat.label}</h4>
                <p className="stat-sublabel">{stat.sublabel}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
