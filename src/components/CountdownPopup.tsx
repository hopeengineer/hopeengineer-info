
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Rocket } from 'lucide-react';

const calculateTimeLeft = () => {
  if (typeof window === 'undefined') return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const now = new Date();
  const targetDate = new Date(now.getFullYear(), now.getMonth(), 26);

  if (now > targetDate) {
    targetDate.setMonth(targetDate.getMonth() + 1);
  }

  const difference = targetDate.getTime() - now.getTime();

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

const CountdownPopup = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <Rocket className="h-12 w-12 text-accent" />
          <DialogTitle className="font-headline text-3xl">Get Ready!</DialogTitle>
          <DialogDescription className="text-lg">
            This new collection of AI Apps is launching soon.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-4 text-center">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center p-2 bg-muted rounded-lg w-20">
              <span className="text-4xl font-bold font-mono">
                {String(value).padStart(2, '0')}
              </span>
              <span className="text-xs uppercase text-muted-foreground">{unit}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CountdownPopup;
