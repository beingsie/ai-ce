document.addEventListener('DOMContentLoaded', function () {
    const rateInput = document.getElementById('rateInput');
    const taxesInput = document.getElementById('taxesInput');
    const hoursInput = document.getElementById('hoursInput');
    const rateDisplay = document.getElementById('Rate');
    const taxesDisplay = document.getElementById('Taxes');
    const beforeTaxesTotalDisplay = document.getElementById('BeforeTaxesTotal');
    const afterTaxesTotalDisplay = document.getElementById('AfterTaxesTotal');
    const biWeeklyBills = document.getElementById('biWeeklyBills');
    const biWeeklyLeisure = document.getElementById('biWeeklyLeisure');
    const biWeeklyemergency = document.getElementById('biWeeklyemergency');
    const monthlyBills = document.getElementById('monthlyBills');
    const monthlyLeisure = document.getElementById('monthlyLeisure');
    const monthlyemergency = document.getElementById('monthlyemergency');
    const budgetForm = document.getElementById('budgetForm');
    const billsPercentageInput = document.getElementById('billsPercentage');
    const leisurePercentageInput = document.getElementById('leisurePercentage');
    const emergencyPercentageInput = document.getElementById('emergencyPercentage');

    function updateDisplayedValues() {
        const rateValue = parseFloat(rateInput.value.replace(/,/g, '')) || 0;
        const taxesValue = parseFloat(taxesInput.value.replace(/,/g, '')) || 0;
        const hoursValue = parseFloat(hoursInput.value.replace(/,/g, '')) || 0;

        const totalRate = rateValue * hoursValue;
        const afterTaxesTotal = totalRate - taxesValue;

        rateDisplay.textContent = `$${totalRate.toFixed(2)}`;
        taxesDisplay.textContent = `$${taxesValue.toFixed(2)}`;
        beforeTaxesTotalDisplay.textContent = `$${totalRate.toFixed(2)}`;
        afterTaxesTotalDisplay.textContent = `$${afterTaxesTotal.toFixed(2)}`;

        updateRuleBreakdown(afterTaxesTotal);
    }

    function updateRuleBreakdown(afterTaxesTotal) {
        const billsPercentage = parseFloat(billsPercentageInput.value) / 100 || 0.50;
        const leisurePercentage = parseFloat(leisurePercentageInput.value) / 100 || 0.30;
        const emergencyPercentage = parseFloat(emergencyPercentageInput.value) / 100 || 0.20;
        const monthlyTotal = afterTaxesTotal * 2;
        const biWeeklyBillsAmount = afterTaxesTotal * billsPercentage;
        const biWeeklyLeisureAmount = afterTaxesTotal * leisurePercentage;
        const biWeeklyemergencyAmount = afterTaxesTotal * emergencyPercentage;
        const monthlyBillsAmount = monthlyTotal * billsPercentage;
        const monthlyLeisureAmount = monthlyTotal * leisurePercentage;
        const monthlyemergencyAmount = monthlyTotal * emergencyPercentage;

        biWeeklyBills.textContent = `$${biWeeklyBillsAmount.toFixed(2)}`;
        biWeeklyLeisure.textContent = `$${biWeeklyLeisureAmount.toFixed(2)}`;
        biWeeklyemergency.textContent = `$${biWeeklyemergencyAmount.toFixed(2)}`;
        monthlyBills.textContent = `$${monthlyBillsAmount.toFixed(2)}`;
        monthlyLeisure.textContent = `$${monthlyLeisureAmount.toFixed(2)}`;
        monthlyemergency.textContent = `$${monthlyemergencyAmount.toFixed(2)}`;
    }

    function saveToLocalStorage() {
        localStorage.setItem('rateValue', rateInput.value);
        localStorage.setItem('taxesValue', taxesInput.value);
        localStorage.setItem('hoursValue', hoursInput.value);
        localStorage.setItem('billsPercentage', billsPercentageInput.value);
        localStorage.setItem('leisurePercentage', leisurePercentageInput.value);
        localStorage.setItem('emergencyPercentage', emergencyPercentageInput.value);
    }

    function loadFromLocalStorage() {
        rateInput.value = localStorage.getItem('rateValue') || '';
        taxesInput.value = localStorage.getItem('taxesValue') || '';
        hoursInput.value = localStorage.getItem('hoursValue') || '';
        billsPercentageInput.value = localStorage.getItem('billsPercentage') || '50';
        leisurePercentageInput.value = localStorage.getItem('leisurePercentage') || '30';
        emergencyPercentageInput.value = localStorage.getItem('emergencyPercentage') || '20';
        updateDisplayedValues();
    }

    rateInput.addEventListener('input', function() {
        saveToLocalStorage();
        updateDisplayedValues();
    });
    taxesInput.addEventListener('input', function() {
        saveToLocalStorage();
        updateDisplayedValues();
    });
    hoursInput.addEventListener('input', function() {
        saveToLocalStorage();
        updateDisplayedValues();
    });
    billsPercentageInput.addEventListener('input', function() {
        saveToLocalStorage();
        updateDisplayedValues();
    });
    leisurePercentageInput.addEventListener('input', function() {
        saveToLocalStorage();
        updateDisplayedValues();
    });
    emergencyPercentageInput.addEventListener('input', function() {
        saveToLocalStorage();
        updateDisplayedValues();
    });

    budgetForm.addEventListener('reset', function() {
        setTimeout(function() {
            rateInput.value = '';
            taxesInput.value = '';
            hoursInput.value = '';
            billsPercentageInput.value = '50';
            leisurePercentageInput.value = '30';
            emergencyPercentageInput.value = '20';
            saveToLocalStorage();
            updateDisplayedValues();
        }, 0);
    });

    loadFromLocalStorage();
});
