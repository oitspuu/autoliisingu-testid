import { expect } from '@wdio/globals'
import Page from '../pageobjects/page.ts'


describe('Car lease calculator - test percentage calculation', () => {
    it('should calculate initial payment percentages correctly', async () => {
        await Page.open()
        await Page.cookieConsent();

        let price = Page.purchasePrice;
        await Page.clear(price);
        await price.addValue('10 000');

        await expect(price).toHaveValue('10 000');

        let paymentAmount = Page.paymentAmount;
        await paymentAmount.setValue('2 000');
        await expect(paymentAmount).toHaveValue('2 000');
        await expect(Page.paymentPercent).toHaveValue('20');


    })

    it('should calculate initial payment sum correctly', async () => {

        let price = Page.purchasePrice;
        await Page.clear(price);
        await price.addValue('20 000');

        await expect(price).toHaveValue('20 000');

        let paymentPercent = Page.paymentPercent;
        await paymentPercent.setValue('10');
        await expect(paymentPercent).toHaveValue('10');
        await expect(Page.paymentAmount).toHaveValue('2 000');

    })

    it('should calculate last payment percentage correctly', async () => {

        let price = Page.purchasePrice;
        await Page.clear(price);
        await price.addValue('20 000');

        let lastPaymentPercent = Page.lastPaymentPercent;
        await Page.clear(lastPaymentPercent);
        await lastPaymentPercent.setValue('0');

        let lastPaymentAmount = Page.lastPaymentAmount;
        await Page.clear(lastPaymentAmount);
        await lastPaymentAmount.setValue('10000');
        await expect(Page.lastPaymentPercent).toHaveValue('50');

    })

    it('should calculate last payment amount correctly', async () => {

        let price = Page.purchasePrice;
        await Page.clear(price);
        await price.addValue('200 000');

        let lastPaymentPercent = Page.lastPaymentPercent;
        await Page.clear(lastPaymentPercent);
        await lastPaymentPercent.setValue('25');
        await expect(Page.lastPaymentAmount).toHaveValue('50 000');

    })
})

describe('Car lease calculator - test monthly payment', () => {
    it('should calculate monthly payment correctly without initial payment', async () => {

        let price = Page.purchasePrice;
        await Page.clear(price);
        await price.addValue('20 000');

        let paymentPercent = Page.paymentPercent;
        await Page.clear(paymentPercent);
        await paymentPercent.setValue('0');
        await expect(paymentPercent).toHaveValue('0');

        let lastPaymentPercent = Page.lastPaymentPercent;
        await Page.clear(lastPaymentPercent);
        await lastPaymentPercent.setValue('0');

        let period = Page.period;
        await Page.clear(period);
        await period.addValue('60');
        await expect(period).toHaveValue('60');

        let payment = await Page.monthlyPayment.getText();
        payment = payment.replace(/[\s€]/g, '').replace(',', '.');
        let monthly = parseFloat(payment);

        let priceValue = (await price.getValue()).replace(/\s/g, '');

        await expect(monthly*parseInt(await period.getValue())).toBeGreaterThan(parseInt(priceValue));

    })

    it('should calculate monthly payment correctly with initial payment', async () => {

        let price = Page.purchasePrice;
        await Page.clear(price);
        await price.addValue('40 000');

        let paymentPercent = Page.paymentPercent;
        await Page.clear(paymentPercent);
        await paymentPercent.setValue('10');
        await expect(paymentPercent).toHaveValue('10');

        let period = Page.period;

        let payment = await Page.monthlyPayment.getText();
        payment = payment.replace(/[\s€]/g, '').replace(',', '.');
        let monthly = parseFloat(payment);

        let priceValue = (await price.getValue()).replace(/\s/g, '');
        let initialPayment = (await Page.paymentAmount.getValue()).replace(/\s/g, '');

        await expect(monthly*parseInt(await period.getValue())).toBeGreaterThan(parseInt(priceValue)- parseInt(initialPayment));

    })
})
