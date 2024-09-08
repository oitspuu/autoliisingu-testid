import { browser } from '@wdio/globals'
import {Key} from 'webdriverio'

/**
* main page object containing all methods, selectors and functionality
*/
class Page {

    public open() {
        return browser.url(`https://www.cooppank.ee/eraklient/auto/liising`);
    }

    public async cookieConsent() {
        try {
            let element = $('#cookie-modal');
            if(await element.isExisting()) {
                element = element
                    .$$('div')[1]
                    .$('section div div div')
                    .nextElement()
                    .$('button');
                let isClickable = await element.isClickable();
                if (isClickable) {
                    await element.click();
                }
            }

        } catch (ignored) {

        }
    }

    public get purchasePrice() {
        return $('#priceOfVehicle');
    }

    public get period(){
        return $('#periodMonths');
    }

    public get paymentPercent(){
        return $('#initialPaymentPercent');
    }

    public get paymentAmount(){
        return $('#initialPaymentAmount');
    }

    public get lastPaymentPercent(){
        return $('#lastPaymentPercent');
    }

    public get lastPaymentAmount(){
        return $('#lastPaymentAmount');
    }

    public get radioFinancial(){
        return $('#type.FINANCIAL_LEASE');
    }

    public get radioOperational(){
        return $('#type.OPERATIONAL_LEASE');
    }

    public get monthlyPayment(){
        return $('//form/div/div[3]/div[1]/h2');

    }

    public async clearAndSet(selector : ChainablePromiseElement, inputString : string){
        // setValue did not clear input, chromedriver issue?
        await selector.doubleClick();
        await browser.keys([Key.Ctrl, 'a']);
        await browser.keys([Key.Ctrl]);
        await browser.keys([Key.Delete]);
        await selector.addValue(inputString);
    }
}

export default new Page();
