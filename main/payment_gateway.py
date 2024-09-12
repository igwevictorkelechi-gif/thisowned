from rave_python import Rave, RaveExceptions, Misc
from django.core.cache import cache

rave = Rave(publicKey="FLWPUBK_TEST-380f1afe6eecd676ed28d331ccee3b59-X",
            secretKey="FLWSECK_TEST-061f54796566f69722405b7a95808432-X", usingEnv=False)

# payload = {
#     "cardno": "5531886652142950",
#     "cvv": "564",
#     "expirymonth": "09",
#     "expiryyear": "32",
#     "amount": "1300",
#     "email": "sheriffismail360@gmail.com.com",
#     "phonenumber": "0902620185",
#     "firstname": "temi",
#     "lastname": "desola",
# }
#
# address={"billingzip": "07205", "billingcity": "Hillside",
#             "billingaddress": "470 Mundet PI",
#             "billingstate": "NJ", "billingcountry": "US"}


def pay_with_card(payload, address):

    try:
        res = rave.Card.charge(payload)
        cache.set(res["txRef"], payload)

        if res["suggestedAuth"]:
            arg = Misc.getTypeOfArgsRequired(res["suggestedAuth"])

            if arg == "address":
                Misc.updatePayload(res["suggestedAuth"], payload,
                                   address=address)
            else:
                return res
        return res

    except RaveExceptions.CardChargeError as e:
        print(e.err["errMsg"])
        print(e.err["flwRef"])

    except RaveExceptions.TransactionValidationError as e:
        print(e.err)
        print(e.err["flwRef"])

    except RaveExceptions.TransactionVerificationError as e:
        print(e.err["errMsg"])
        print(e.err["txRef"])


def auth_card(tx_ref, suggested_auth, value):
    try:
        arg = Misc.getTypeOfArgsRequired(suggested_auth)
        payload = cache.get(tx_ref)
        if arg == "pin":
            Misc.updatePayload(suggested_auth, payload, pin=value)

        if arg == "otp":
            Misc.updatePayload(suggested_auth, payload, otp=value)

        res = rave.Card.charge(payload)
        if res["validationRequired"]:
            res = rave.Card.verify(res["txRef"])
            return res
        return res

    except RaveExceptions.TransactionValidationError as e:
        print(e.err)
        print(e.err["flwRef"])


def validate_card(flw_ref, value):
    res = rave.Card.validate(flw_ref, value)
    res = rave.Card.verify(res["txRef"])
    return res

