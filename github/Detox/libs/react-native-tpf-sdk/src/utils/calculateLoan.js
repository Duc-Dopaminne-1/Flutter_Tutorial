export const CalculatePrincipalBalance = (loanAmount, interestRate, duration) => {
  const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;
  const principalPaidMonthly = parseFloat(loanAmount) / parseInt(duration, 10);
  const firstInterest = parseFloat(loanAmount) * monthlyInterestRate;
  const remainInterest = (parseFloat(loanAmount) - principalPaidMonthly) * monthlyInterestRate;
  // const interestPaidMonthly = (firstInterest + remainInterest) / parseInt(duration, 10);
  const interestPaid = Array.from(Array(parseInt(duration, 10)), (v, i) => {
    if (i === 0) {
      return firstInterest;
    } else {
      return (parseFloat(loanAmount) - principalPaidMonthly * i) * monthlyInterestRate;
    }
  });
  const totalInterestPaid = interestPaid.reduce((result, currentValue) => result + currentValue, 0);
  const interestPaidMonthly = totalInterestPaid / parseInt(duration, 10);
  const totalPaid = totalInterestPaid + parseFloat(loanAmount);
  return {
    interestPaidMonthly: interestPaidMonthly,
    principalPaidMonthly: principalPaidMonthly,
    totalPaidMonthly: interestPaidMonthly,
    totalPaid: totalPaid
  };
};

export const CalculateRemainingBalance = (loanAmount, interestRate, duration) => {
  if (loanAmount && interestRate && duration) {
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;
    const firstMonthInterest = parseFloat(loanAmount) * monthlyInterestRate;
    const principalPaidMonthly = parseFloat(loanAmount) / parseInt(duration, 10);
    const interestPaidMonthly = Array.from(Array(parseInt(duration, 10)), (v, i) => {
      if (i === 0) {
        return firstMonthInterest;
      } else {
        return monthlyInterestRate * (parseFloat(loanAmount) - principalPaidMonthly * i);
      }
    });
    const totalInterestPaid = interestPaidMonthly.reduce(
      (result, currentValue) => result + currentValue,
      0
    );
    const totalPaid = totalInterestPaid + parseFloat(loanAmount);
    return {
      firstMonthInterest: firstMonthInterest,
      principalPaidMonthly: principalPaidMonthly,
      interestPaidMonthly,
      totalInterestPaid: totalInterestPaid,
      totalPaid: totalPaid
    };
  }
};
