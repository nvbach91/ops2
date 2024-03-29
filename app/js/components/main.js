
/* 
 *   Created on : Jan 28, 2016, 12:24:53 PM
 *   Author     : Nguyen Viet Bach
 */

Array.prototype.binaryIndexOf = binaryIndexOf;

$(document).ready(function () {
    var kc = $("#kc");
    // reset checkout
    var jSaleList = $("#sale-list");
    $("#discard-sale").click(function () {
        jSaleList.find(".sale-item").slideUp(getAnimationTime(), function () {
            $(this).remove();
            recalculateTotalCost();
        });
    });

    // Price input accepts only numeric values, also only reacts to enter and backspace
    var jPriceInput = $("#price-input");
    var jRegistrySession = $("#registry-session");
    jPriceInput.keydown(function (e) {
        return checkPriceInput(e, kc, jPriceInput);
    }).blur(function () {
        var p = $(this).val();
        if (!/^\-?\d+\*?(\d+)?$/g.test(p) || p === "-") {
            $(this).val("");
            return false;
        }
        if (p.indexOf("*") >= 0) {
            return true;
        }
        var sign = "";
        if (p.charAt(0) === "-") {
            p = p.slice(1);
            sign = "-";
        }
        var correctValue = correctPrice(p);
        if (!correctValue) {
            jPriceInput.val("");
            return false;
        }
        jPriceInput.val(sign + correctValue);
    }).click(function () {
        jPriceInput.val("");
        jRegistrySession.text("0");
    }).focus(function () {
        jPriceInput.val("");
        jRegistrySession.text("0");
    });

    // Clicking on sale-group buttons adds an item to the sale list
    $("#sale-groups button").click(function () {
        var t = $(this);
        //var lastItem = jSaleList.find(".sale-item.last");
        // do not register an item of different group while price input is the same
        // user must type the same price for another sale group
        // reset the price input and play error sound
        var lastItem = jSaleList.find(".sale-item.last");
        if (lastItem.size() && t.text() !== lastItem.find(".si-id").text()
                && jRegistrySession.text() === "1") {
            jPriceInput.val("");
            return false;
        }
        var v = jPriceInput.val();
        var a = v.indexOf("*");
        var price = a >= 0 ? v.slice(a + 1, v.length) : v;
        if (price.length === 0 || parseInt(price) === 0) {
            jPriceInput.val("");
            return false;
        }
        var mult = getMultiplicationNumber(jPriceInput);
        
        price = correctPrice(price);
        jPriceInput.val(price);
        
        var id = t.text();
        var name = t.text();
        var group = t.text();
        var tax = t.text();
        var tags = t.text();
        var desc = t.text();
        addItemToCheckout(id, "", name, price, group, tax, tags, desc, mult);
        jRegistrySession.text("1");
    });

    // bind quick sell buttons
    $("#quick-sales .qs-item button").click(function () {
        var t = $(this);
        var price = t.parent().find(".qs-price").text();
        var mult = getMultiplicationNumber(jPriceInput);
        jPriceInput.val(price);
        var name = t.text();
        var id = t.parent().find(".qs-id").text();
        var tax = t.parent().find(".qs-tax").text();
        var group = t.parent().find(".qs-group").text();
        var tags = t.parent().find(".qs-tags").text();
        var desc = t.parent().find(".qs-desc").text();
        
        addItemToCheckout(id, "", name, price, group, tax, tags, desc, mult);

        jRegistrySession.text("1");
    });

    // bind control panel buttons
    $("#logo > div").click(function () {
        $("#menu-left").addClass("visible");
    });
    $("#menu-header > div, #main").click(function () {
        $("#menu-left").removeClass("visible");
    });

    // bind pay button to proceed to payment, generate payment box
    $("#pay").click(function () {
        if (jSaleList.find(".sale-item").size() < 1) {
            return false;
        }
        var paymentBox = $("<div></div>").attr("id", "payment-box")
                .click(function (e) {
                    e.stopPropagation();
                });
        $("<div></div>").addClass("pb-header")
                .append($("<div></div>").addClass("pb-title").text("Payment"))
                .append($("<button></button>").addClass("pb-close").click(function () {
                    $(this).parents("#curtain").fadeOut(getAnimationTime(), function () {
                        $(this).remove();
                    });
                })).appendTo(paymentBox);
        var paymentBody = $("<div></div>").addClass("pb-body");
        var receipt = $("<div></div>").addClass("receipt");
        $("<div></div>").addClass("receipt-header").text("Receipt Preview").appendTo(receipt);
        var receiptBody = $("<ul></ul>").addClass("receipt-body");
        jSaleList.find(".sale-item").each(function () {
            var t = $(this);
            var q = t.find(".si-quantity").val();
            var n = t.find(".si-name").text();
            var thisTotal = t.find(".si-total").text();
            var receiptItem = $("<li></li>").addClass("receipt-item")
                    .append($("<div></div>").addClass("ri-n").text(n))
                    .append($("<div></div>").addClass("ri-x"))
                    .append($("<div></div>").addClass("ri-q").text(q))
                    .append($("<div></div>").addClass("ri-tt").text(thisTotal));
            receiptBody.append(receiptItem);
        });
        var total = $("#pay-amount").text().replace(/,/g, ".").replace(/[^\d\.\-]/g, "");
        receiptBody.appendTo(receipt);
        $("<div></div>").addClass("receipt-footer").text("EnterpriseApps").appendTo(receipt);

        var payment = $("<div></div>").attr("id", "payment");
        $("<div></div>").addClass("cash-pay-label").text("Amount to pay").appendTo(payment);
        $("<div></div>").attr("id", "cash-pay-topay").text(total + " Kč").appendTo(payment);
        $("<div></div>").addClass("cash-pay-label").text("Amount tendered").appendTo(payment);
        var cashInputContainer = $("<div></div>").attr("id", "cash-input-container");
        $("<input/>").attr("id", "cash-input")
                .attr("placeholder", "0.00")
                .attr("maxlength", "6")
                .val(parseFloat(total) < 0 ? 0 : total)
                .keydown(function (e) {
                    return checkNumericInput(e, this);
                })
                .blur(function () {
                    var t = $(this);
                    var p = t.val();
                    var correctValue = correctPrice(p);
                    if (!correctValue || !/^\-?\d+\.\d{2}$/g.test(correctValue)) {
                        t.addClass("invalid");
                        t.parent().find("button.cash-confirm").addClass("disabled");
                        return false;
                    }
                    t.removeClass("invalid");
                    t.parent().find("button.cash-confirm").removeClass("disabled");
                    t.val(correctValue);
                    $("#cash-change").text(parseFloat(t.val()) - parseFloat(total) + " Kč");
                })
                .focus(function () {
                    $(this).select();
                }).appendTo(cashInputContainer);
        $("<button></button>").addClass("cash-confirm").text("OK")
                .appendTo(cashInputContainer)
                .click(function () {
                    var t = $(this);
                    if (!t.hasClass("disabled")) {

                    }
                });

        cashInputContainer.appendTo(payment);
        var quickCashLabel = $("<div></div>").addClass("cash-quick-label").text("Quick cash payment");
        quickCashLabel.appendTo(payment);
        var quickCash = $("<div></div>").addClass("cash-quick");
        var qcs = [100, 200, 500, 1000, 2000, 5000];
        for (var i = 0; i < qcs.length; i++) {
            $("<button></button>").addClass("cash-button").text(qcs[i])
                    .click(function () {
                        var t = $(this);
                        var cash = t.text();
                        $("#cash-input").val(cash + "00").blur();
                        t.parents("#payment").find("button.cash-confirm").removeClass("disabled");
                        $("#cash-change").text(cash - parseFloat(total) + " Kč");
                    })
                    .appendTo(quickCash);
        }
        quickCash.appendTo(payment);

        $("<div></div>").addClass("cash-pay-label").text("Change").appendTo(payment);
        $("<div></div>").attr("id", "cash-change").text(0).appendTo(payment);

        payment.appendTo(paymentBody);
        $("<div></div>").addClass("receipt-container").append(receipt).appendTo(paymentBody);

        paymentBody.appendTo(paymentBox);

        showInCurtain(paymentBox);
    });

    var catalog = {items: []};
    for (var i = 0; i < 1; i++) {
        catalog.items.push(new Item(
                Math.floor((Math.random() * 10) + 1) + i,
                "40152233",
                "Water " + i,
                (15 + i) + ".00",
                "description"
                ));
    }
    catalog.items.sort(function (a, b) {
        return a.ean < b.ean ? -1 : 1;
    });
    //g = catalog.items;
    //var dropDown = $("#dropdown");
    var jSearchBox = $("#search");
    jSearchBox.keyup(function (e) {
        var t = $(this);
        if (e.keyCode === 13) {
            var filter = t.val();
            var i = catalog.items.binaryIndexOf(filter);
            if (i >= 0) {
                var item = catalog.items[i];
                var mult = getMultiplicationNumber(jPriceInput);
                addItemToCheckout(
                    item.id,
                    item.ean,
                    item.name,
                    item.price,
                    item.group,
                    item.tax,
                    item.tags,
                    item.desc,
                    // multiplication number
                    mult
                );         
                jRegistrySession.text("0");
                jPriceInput.val("");
                t.removeClass("not-found");
            } else {
                t.addClass("not-found");
            }
            t.val("");
        }
    }).click(function () {
        $(this).removeClass("not-found");
    }).focus(function () {
        $(this).removeClass("not-found");
    });

    $(document).scannerDetection(function (s) {
        jPriceInput.blur();
        jSearchBox.val(s);
        var e = $.Event('keyup');
        e.keyCode = 13;
        jSearchBox.trigger(e);
    });
    /*
     dropDown.html(createFoundItem(item.name, item.price));
     dropDown.addClass("visible");
     } else {
     dropDown.html("");
     }*/
    /*$("#live-search").blur(function () {
     dropDown.html("");
     dropDown.removeClass("visible");
     });*/
});
