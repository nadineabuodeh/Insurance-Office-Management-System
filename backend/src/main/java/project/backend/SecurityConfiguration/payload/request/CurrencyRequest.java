package project.backend.SecurityConfiguration.payload.request;

import project.backend.SecurityConfiguration.models.CurrencyType;

public class CurrencyRequest {
    private CurrencyType currency;

    public CurrencyType getCurrency() {
        return currency;
    }

    public void setCurrency(CurrencyType currency) {
        this.currency = currency;
    }
}
