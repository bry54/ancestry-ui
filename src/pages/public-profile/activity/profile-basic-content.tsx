import { useState } from 'react';
import { SystemLog } from '@/partials/activities/interview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProfileActivityContent() {
  const [currentYear, setCurrentYear] = useState(2025);
  const years = Array.from({ length: 8 }, (_, i) => 2025 - i);

  return (
    <div className="flex gap-5 lg:gap-7.5">
      {years.map((year, index) => (
        <Card
          key={index}
          className={`grow ${year === currentYear ? '' : 'hidden'}`}
          id={`activity_${year}`}
        >
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <SystemLog />
          </CardContent>
        </Card>
      ))}
      <div className="flex flex-col gap-2.5">
        {years.map((year, index) => (
          <Button
            key={index}
            variant={year === currentYear ? 'primary' : 'dim'}
            appearance="ghost"
            size="sm"
            className="justify-start gap-1"
            onClick={() => setCurrentYear(year)}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );
}
