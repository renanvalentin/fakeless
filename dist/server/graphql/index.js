'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolver = exports.schema = undefined;

var _graphql = require('graphql');

const schema = exports.schema = (0, _graphql.buildSchema)(`
    type CreditCardLabel {
        nameOnCard: String,
        cardNumber: String,
        expiryDate: String,
        cvv: String,
    }

    type CreditCardError {
        nameOnCard: String,
        pan: String,
        expiryDate: String,
        expiryDateMonth: String,
        expiryDatePast: String,
        cvv: String,
    }    

    type CreditCard {
       label: CreditCardLabel,
       error: CreditCardError
    }


    type Translation {
        creditCard: CreditCard
    }

    type Query {
        translation: Translation
    }
`);

const resolver = exports.resolver = {
  translation: () => ({
    creditCard: {
      label: {
        nameOnCard: 'nameOnCard',
        cardNumber: 'cardNumber',
        expiryDate: 'expiryDate',
        cvv: 'cvv'
      },
      error: {
        nameOnCard: 'nameOnCard',
        pan: 'pan',
        expiryDate: 'expiryDate',
        expiryDateMonth: 'expiryDateMonth',
        expiryDatePast: 'expiryDatePast',
        cvv: 'cvv'
      }
    }
  })
};
//# sourceMappingURL=index.js.map