import {expect} from '@wdio/globals'
import Page from '../pageobjects/page.ts'


before(async () => {
    await Page.open();
    await Page.cookieConsent();
})


describe('Car lease calculator - test percentage calculation ', () => {
    it('should calculate initial payment percentages correctly', async () => {

        let price = Page.purchasePrice;
        await Page.clearAndSet(price, '10000');

        await expect(price).toHaveValue('10 000');

        let paymentAmount = Page.paymentAmount;
        await Page.clearAndSet(paymentAmount, '2000');
        await expect(paymentAmount).toHaveValue('2 000');
        await expect(Page.paymentPercent).toHaveValue('20');

    })

    it('should calculate initial payment sum correctly', async () => {

        let price = Page.purchasePrice;
        await Page.clearAndSet(price, '20000');
        await expect(price).toHaveValue('20 000');

        let paymentPercent = Page.paymentPercent;
        await Page.clearAndSet(paymentPercent, '10');
        await expect(paymentPercent).toHaveValue('10');
        await expect(Page.paymentAmount).toHaveValue('2 000');

    })

    it('should calculate last payment percentage correctly', async () => {

        let price = Page.purchasePrice;
        await Page.clearAndSet(price, '20000');
        await expect(price).toHaveValue('20 000');

        let lastPaymentPercent = Page.lastPaymentPercent;
        await Page.clearAndSet(lastPaymentPercent, '0');

        await Page.clearAndSet(Page.lastPaymentAmount, '10000');
        await expect(lastPaymentPercent).toHaveValue('50');
    })

    it('should calculate last payment amount correctly', async () => {

        let price = Page.purchasePrice;
        await Page.clearAndSet(price, '200000');

        await Page.clearAndSet(Page.lastPaymentPercent, '25');
        await expect(Page.lastPaymentAmount).toHaveValue('50 000');

    })
})

describe('Car lease calculator - test monthly payment ', () => {
    it('should calculate monthly payment correctly without initial payment', async () => {

        let price = Page.purchasePrice;
        await Page.clearAndSet(price, '20000');

        await Page.clearAndSet(Page.paymentPercent, '0');

        await Page.clearAndSet(Page.lastPaymentPercent, '0');

        let period = Page.period;
        await Page.clearAndSet(period, '60');
        await expect(period).toHaveValue('60');

        let payment = await Page.monthlyPayment.getText();
        payment = payment.replace(/[\s€]/g, '').replace(',', '.');
        let monthly = parseFloat(payment);

        let priceValue = (await price.getValue()).replace(/\s/g, '');

        await expect(monthly*parseInt(await period.getValue())).toBeGreaterThan(parseInt(priceValue));

    })

    it('should calculate monthly payment correctly with initial payment', async () => {

        let price = Page.purchasePrice;
        await Page.clearAndSet(price, '40000');

        await Page.clearAndSet(Page.paymentPercent, '10');

        let period = Page.period;

        let payment = await Page.monthlyPayment.getText();
        payment = payment.replace(/[\s€]/g, '').replace(',', '.');
        let monthly = parseFloat(payment);

        let priceValue = (await price.getValue()).replace(/\s/g, '');
        let initialPayment = (await Page.paymentAmount.getValue()).replace(/\s/g, '');

        await expect(monthly*parseInt(await period.getValue())).toBeGreaterThan(parseInt(priceValue)- parseInt(initialPayment));

    })
})
