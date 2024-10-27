import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Section, Card, Button, Icon, Toggle, CardItem, ThemeBrowser } from '../components/ui';

export function Settings() {
  const { currentTheme, changeTheme, availableThemes } = useTheme();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h1 className="text-2xl font-semibold text-text">Settings</h1>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Appearance Section */}
        <Section title="Appearance">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-text">Theme</h3>
                  <p className="text-sm text-text-light mt-1">
                    Choose how ChayCards looks to you
                  </p>
                </div>
              </div>
              <ThemeBrowser
                themes={availableThemes}
                currentTheme={currentTheme}
                onThemeSelect={changeTheme}
              />
            </div>
          </Card>
        </Section>

        {/* General Section */}
        <Section title="General">
          <Card divided>
            <CardItem>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-text">Auto Save</h3>
                  <p className="text-sm text-text-light mt-1">Automatically save changes to documents</p>
                </div>
                <Toggle />
              </div>
            </CardItem>
            <CardItem>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-text">Keyboard Shortcuts</h3>
                  <p className="text-sm text-text-light mt-1">View and customize keyboard shortcuts</p>
                </div>
                <Button>View Shortcuts</Button>
              </div>
            </CardItem>
          </Card>
        </Section>

        {/* About Section */}
        <Section title="About">
          <Card divided>
            <CardItem>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-text">Version</h3>
                <span className="text-sm text-text-light">0.1.0</span>
              </div>
            </CardItem>
            <CardItem>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-text">Check for Updates</h3>
                <Button
                  icon={<Icon name="refresh" className="w-4 h-4" />}
                >
                  Check Now
                </Button>
              </div>
            </CardItem>
          </Card>
        </Section>
      </div>
    </div>
  );
}
