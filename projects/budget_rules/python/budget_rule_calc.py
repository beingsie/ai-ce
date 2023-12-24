monthly_income_str = input('Enter your monthly income: ')
while not monthly_income_str.replace(".", "").isdigit():
    print('Invalid input. Please enter a numeric value.')
    monthly_income_str = input('Enter your monthly income: ')

monthly_income = float(monthly_income_str)

budget = {
    'Needs': monthly_income * 0.50,  # 50% for needs
    'Wants': monthly_income * 0.15,  # 15% for wants
    'Savings/Debt Repayment': monthly_income * 0.35  # 35% for savings/debt repayment
}

print('\nBudget Allocation based on 50/30/20 rule:')
for category, amount in budget.items():
    print(f'{category}: ${amount:.2f}')
