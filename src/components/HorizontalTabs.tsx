import type { HorizontalTabsProps } from '@/types';
import { useState, Suspense, useTransition } from 'react';
import SectionLoading from './SectionLoading';

const HorizontalTabs = ({
  tabs,
  defaultTabId,
  extraContent,
  className = '',
}: HorizontalTabsProps) => {
  const initialActiveId = defaultTabId ?? tabs[0]?.id ?? '';
  const [selectedTabId, setSelectedTabId] = useState<string>(initialActiveId);
  const [renderedTabId, setRenderedTabId] = useState<string>(initialActiveId);
  const [isPending, startTransition] = useTransition();

  if (!tabs || tabs.length === 0) {
    return null;
  }

  const activeTab = tabs.find((tab) => tab.id === renderedTabId) ?? tabs[0];

  const handleTabClick = (tabId: string) => {
    if (tabId === selectedTabId) {
      return;
    }

    // Paint the tab button state immediately, then defer heavy panel rendering.
    setSelectedTabId(tabId);
    startTransition(() => {
      setRenderedTabId(tabId);
    });
  };

  return (
    <div className={`space-y-4 rounded-md border border-slate-700 p-1 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 px-2 pb-2">
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = tab.id === selectedTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`rounded-t-md px-4 py-2  font-semibold transition-colors duration-150 ${
                  isActive
                    ? 'border-b-2 border-blue-400  text-white'
                    : 'border-b-2 border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {extraContent ? <div className="min-w-0 truncate px-2">{extraContent}</div> : null}
      </div>

      <div className="rounded-b-md p-4">
        {isPending ? (
          <SectionLoading />
        ) : (
          <Suspense fallback={<SectionLoading />}>{activeTab.content}</Suspense>
        )}
      </div>
    </div>
  );
};

export default HorizontalTabs;
