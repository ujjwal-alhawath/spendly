import React from 'react';
import { RecentTransactions } from './RecentTransactions';

export function RecentList({ expenses }) {
  return <RecentTransactions expenses={expenses} />;
}
