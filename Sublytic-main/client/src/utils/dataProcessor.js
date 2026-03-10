export const calculateStats = (data) => {
  const totalSpent = data.reduce((sum, sub) => sum + parseFloat(sub.cost), 0);
  const monthlyCost = data.reduce((sum, sub) => {
    const cycle = sub.billingCycle.toLowerCase();
    let value = parseFloat(sub.cost);
    if (cycle.includes('annual')) value /= 12;
    if (cycle.includes('quarter')) value /= 3;
    return sum + value;
  }, 0);

  const upcomingRenewals = data.filter(sub => {
    // Basic logic for demonstration; a more robust solution would be needed
    const nextRenewalDate = new Date(sub.firstBillDate);
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextRenewalDate > now && nextRenewalDate <= nextMonth;
  });

  const categories = [...new Set(data.map(sub => sub.category))].length;

  return {
    totalSpent,
    monthlyCost,
    renewals: upcomingRenewals.length,
    categories,
  };
};

export const calculateUpcomingRenewals = (data) => {
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  return data
    .map(sub => ({ ...sub, nextRenewalDate: new Date(sub.firstBillDate) }))
    .filter(sub => sub.nextRenewalDate > now && sub.nextRenewalDate <= nextMonth)
    .map(sub => ({
      id: sub.id,
      name: sub.name,
      date: sub.nextRenewalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: sub.cost
    }));
};

export const calculateCategoryBreakdown = (data) => {
  const totalSpent = data.reduce((sum, sub) => sum + parseFloat(sub.cost), 0);
  const categoryBreakdown = {};
  
  data.forEach(sub => {
    const category = sub.category || 'Uncategorized';
    if (!categoryBreakdown[category]) {
      categoryBreakdown[category] = { amount: 0 };
    }
    categoryBreakdown[category].amount += parseFloat(sub.cost);
  });

  Object.keys(categoryBreakdown).forEach(category => {
    categoryBreakdown[category].percentage = 
      totalSpent > 0 ? Math.round((categoryBreakdown[category].amount / totalSpent) * 100) : 0;
  });

  return categoryBreakdown;
};