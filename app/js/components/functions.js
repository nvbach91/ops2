/* 
 *   Created on : Jan 28, 2016, 12:24:53 PM
 *   Author     : Nguyen Viet Bach
 */


var getAnimationTime = function () {
    return window.innerWidth > 799 ? 100 : 0;
}
;

/**
 * Performs a binary search on the host array. 
 * Implement a valueOf function to your class which returns the value to be compared
 * i.e. Item.prototype.valueOf
 * The Host array must be sorted with Array.prototype.sort(function(lhs, rhs){});
 * @param {*} searchElement The item to search for within the array.
 * @return {Number} The index of the element which defaults to -1 when not found.
 */
var binaryIndexOf = function (searchElement) {
    'use strict';

    var minIndex = 0;
    var maxIndex = this.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = this[currentIndex];

        if (currentElement < searchElement) {
            minIndex = currentIndex + 1;
        }
        else if (currentElement > searchElement) {
            maxIndex = currentIndex - 1;
        }
        else {
            return currentIndex;
        }
    }

    return -1;
};

var endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.endsWith = endsWith;

var formatMoney = function (c, d, t) {
    var n = this,
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d === undefined ? "." : d,
            t = t === undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}
;

Number.prototype.formatMoney = formatMoney;

var createFoundItem = function (name, price) {
    return '<li class="dd-item">' +
            '<div class="dd-name">' + name + '</div>' +
            '<div class="dd-price">' + price + '</div>' +
            '</li>';
};

var isFloat = function (n) {
    return n === Number(n) && n % 1 !== 0;
}
;

var beep = function () {
    var b = document.getElementById("beep");
    b.pause();
    b.currentTime = 0;
    b.play();
}
;

var correctPrice = function (pr) {
    var p = pr.replace(/\./g, "");
    var correctValue = "";
    while (p.length > 2 && p.charAt(0) === "0") {
        p = p.slice(1);
    }
    if (parseInt(p) === 0) {
        return false;
    }
    if (p.length > 2) {
        correctValue = p.slice(0, p.length - 2) + "." + p.slice(p.length - 2, p.length);
    } else if (p.length > 1) {
        correctValue = "0." + p;
    } else if (p.length > 0) {
        correctValue = "0.0" + p;
    }
    return correctValue;
}
;

var recalculateTotalCost = function () {
    var saleList = $("#sale-list");
    if (saleList.children().size() === 1) {
        $("#si-placeholder").removeClass("hidden");
    }
    var totalCost = 0;
    var itemsCnt = 0;
    saleList.find(".sale-item").each(function () {
        var si = $(this);
        var q = parseInt(si.find(".si-quantity").val());
        itemsCnt += q;
        var p = parseFloat(si.find(".si-price").text());
        var subTotal = p * q;
        var discountPercent = si.find(".d-discount").val() / 100;
        subTotal = subTotal - subTotal * discountPercent;
        subTotal.toFixed(2);
        si.find(".si-total").text(subTotal.formatMoney(2, ".", ""));
    });
    saleList.find(".sale-item .si-total").each(function () {
        totalCost += parseFloat($(this).text());
    });
    totalCost.toFixed(2);
    var totalCostText = totalCost.formatMoney(2, ",", " ");
    $("#checkout-total").text("Total: " + totalCostText + " Kč");
    $("#pay-amount").text(totalCostText + " Kč");
    $("#checkout-label").text("CHECKOUT (" + itemsCnt + " item" + (itemsCnt !== 1 ? "s" : "") + ")");
}
;

var checkPriceInput = function (e, u, p) {
    u.text("keyCode: " + e.keyCode);
    //var p = $("#price-input");
    if (e.keyCode === 13) { // allow enter 
        if (p.val().length) {
            p.blur();
        }
        return true;
    }
    if (e.keyCode === 8) { //allow backspace)
        return true;
    }
    if (e.keyCode === 109 || e.keyCode === 189 || e.keyCode === 173) { // check for multiple dashes
        if (p.val().length > 0) {
            return false;
        }
        return true;
        /*var q = p.val();
         return p.val().indexOf("-") < 0;*/
    }
    // allow asterisk for scanner multiplication
    // do not allow more than 99*
    if (e.keyCode === 106) {
        if (p.val().length === 0 || p.val().length > 2) {
            return false;
        }
        if (p.val().indexOf("*") < 0) {
            //p.attr("maxlength", 9);
            return true;
        }
        return false;
    }
    // prevent non-digit key press
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
};

var checkNumericInput = function (e, t) {
    if (e.keyCode === 13) { // allow enter and blur upon press
        t.blur();
        return true;
    }
    if (e.keyCode === 8) { //allow backspace
        return true;
    }

    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
};

var showInCurtain = function (s) {
    var curtain = $("<div></div>").attr("id", "curtain").click(function () {
        $(this).fadeOut(getAnimationTime(), function () {
            $(this).remove();
        });
    });
    curtain.append(s).hide();
    $("#app").append(curtain);
    curtain.fadeIn(getAnimationTime());
}
;

var getMultiplicationNumber = function (jpi) {
    var m = jpi.val();
    if (!m.match(/^\-?[1-9](\d+)?\*(\d+)?$/g)) {
        return 1;
    }
    return parseInt(m.slice(0, m.indexOf("*")));
}
;

var addItemToCheckout = function (id, ean, name, price, group, tax, tags, desc, mult) {
    var jSaleList = $("#sale-list");
    var lastItem = jSaleList.find(".sale-item.last");
    if (id.toString() === lastItem.find(".si-id").text()) {
        if ($("#registry-session").text() === "1") {
            incrementLastItem(lastItem);
            return true;
        }
    }
    var jSaleListPlaceHolder = jSaleList.find("#si-placeholder");
    if (jSaleListPlaceHolder.size()) {
        jSaleListPlaceHolder.addClass("hidden");
    }
    if (jSaleList.children().size() > 0) {
        jSaleList.children().eq(jSaleList.children().size() - 1).removeClass("last");
    }
    // creating sale item and bind events
    var item = $("<li>").addClass("sale-item last");
    var main = $("<div></div>").addClass("sale-item-main");
    $("<div></div>").addClass("si-id").text(id).appendTo(main);
    $("<div></div>").addClass("si-ean").text(ean).appendTo(main);
    $("<div></div>").addClass("si-name").text(name).appendTo(main);
    $("<input />")
            .addClass("si-quantity")
            .attr({maxlength: 3})
            .val(mult ? mult : 1)
            .keydown(function (e) {
                checkNumericInput(e, this);
            })
            .focus(function () {
                $(this).select();
            })
            .blur(function () {
                if (!$(this).val()) {
                    ($(this).val(0));
                }
                recalculateTotalCost();
            })
            .appendTo(main);
    $("<div></div>").addClass("si-price").text(price).appendTo(main);
    $("<div></div>").addClass("si-total").text(price).appendTo(main);
    $("<button></button")
            .addClass("si-remove")
            .click(function () {
                $(this).parent().parent().slideUp(getAnimationTime(), function () {
                    $(this).remove();
                    recalculateTotalCost();
                });
            })
            .appendTo(main);
    main.children(".si-name, .si-price, .si-total").click(function () {
        $(this).parent().parent().find(".sale-item-extend")
                .slideToggle(getAnimationTime(), function () {
                    var t = $(this);
                    if (t.is(":hidden")) {
                        t.parent().removeClass("expanded");
                    } else {
                        t.parent().addClass("expanded");
                    }
                });
    });
    main.appendTo(item);
    var details = $("<div></div>").addClass("sale-item-extend");

    var individualPrice = $("<div></div>").addClass("change-price");
    $("<div></div>").addClass("d-label").text("Individual Price").appendTo(individualPrice);
    $("<input />")
            .addClass("d-price")
            .attr({maxlength: 7, placeholder: "e.g. 4200 = 42.00"})
            .val(price)
            .keydown(function (e) {
                checkNumericInput(e, this);
            })
            .blur(function () {
                var t = $(this);
                var p = t.val();
                var correctValue = correctPrice(p);
                if (!correctValue || !/^\-?\d+\.\d{2}$/g.test(correctValue)) {
                    t.addClass("invalid");
                } else {
                    t.removeClass("invalid");
                    t.val(correctValue);
                    t.parents().eq(2).find(".si-price").text(correctValue);
                    /**************ATTENTION****************/
                    if (jSaleList.find(".d-discount").val() <= 100) {
                        recalculateTotalCost();
                    }
                }
            })
            .focus(function () {
                $(this).select();
            })
            .appendTo(individualPrice);

    var individualDiscount = $("<div></div>").addClass("change-discount");
    $("<div></div>").addClass("d-label").text("Individual Discount (%)").appendTo(individualDiscount);
    $("<input />").addClass("d-discount")
            .attr({maxlength: 3, placeholder: "0 - 100"})
            .val(0)
            .keydown(function (e) {
                checkNumericInput(e, this);
            })
            .blur(function () {
                var t = $(this);
                if (/^\d{1,2}$|^100$/g.test(t.val())) {
                    t.removeClass("invalid");
                    recalculateTotalCost();
                } else {
                    t.addClass("invalid");
                }
            })
            .focus(function () {
                $(this).select();
            })
            .appendTo(individualDiscount);

    var openDetailsLightbox = $("<div></div>").addClass("open-detail");
    $("<div></div>").addClass("d-label").text("Details").appendTo(openDetailsLightbox);

    // bind details button in sale list, generate details box
    $("<button></button>").addClass("d-detail")
            .click(function () {
                var detailsBox = $("<div></div>").attr("id", "details-box").click(function (e) {
                    e.stopPropagation();
                });
                $("<div></div>").addClass("db-header")
                        .append($("<div></div>").addClass("db-title").text("Product Details"))
                        .append($("<button></button>").addClass("db-close").click(function () {
                            $(this).parents().eq(2).remove();
                        })).appendTo(detailsBox);
                var lbBody = $("<div></div>").addClass("db-body");
                var lbInfo = $("<div></div>").addClass("db-info");
                $("<div></div>").addClass("db-name").text("Name: " + name).appendTo(lbInfo);
                $("<div></div>").addClass("db-price").text("Price: " + price + " Kč").appendTo(lbInfo);
                $("<div></div>").addClass("db-group").text("Group: " + group).appendTo(lbInfo);
                $("<div></div>").addClass("db-tax").text("Tax: " + tax).appendTo(lbInfo);
                $("<div></div>").addClass("db-tags").text("Tags: " + tags).appendTo(lbInfo);
                $("<div></div>").addClass("db-desc").text("Description: " + desc).appendTo(lbInfo);
                lbInfo.appendTo(lbBody);
                $("<div></div>").addClass("db-img").appendTo(lbBody);

                lbBody.appendTo(detailsBox);

                showInCurtain(detailsBox);
            })
            .appendTo(openDetailsLightbox);

    individualPrice.appendTo(details);
    individualDiscount.appendTo(details);
    openDetailsLightbox.appendTo(details);

    details.hide();
    details.appendTo(item);
    item.appendTo(jSaleList);

    jSaleList.animate({
        scrollTop: jSaleList[0].scrollHeight
    }, getAnimationTime());

    recalculateTotalCost();
    beep();
}
;
var incrementLastItem = function (lastItem) {
    var lastQuantity = lastItem.find(".si-quantity");
    lastQuantity.val(parseInt(lastQuantity.val()) + 1);
    recalculateTotalCost();
    beep();
}
;