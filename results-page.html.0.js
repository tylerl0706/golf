var socket = io('http://45.55.134.215:9999');
var accepted = [];
var pending = [];
var declined = [];

//socket.on("send.reservations.golfer.accepted", function(data) {
//    accepted = data;
//    console.log("accepted");
//});
//
//socket.on("send.reservations.golfer.pending", function(data) {
//    pending = data;
//    console.log("pending");
//});
//
//socket.on("send.reservations.golfer.declined", function(data) {
//    declined = data;
//    console.log("declined");
//});
/**
 * Created by isabella on 3/28/15.
 */
Polymer('results-page', {

    listToBook: [],

    socket: io('http://45.55.134.215:9999'),

    ready: function() {
        //this.socket = socket;
        //console.log(this.socket);

        this.socket.on("accepted", function(data) {
            accepted = data;
            console.log("accepted");
            this.updateLists();
        });

        this.socket.on("send.reservations.golfer.pending", function(data) {
            pending = data;
            console.log("pending");
            this.updateLists();
        });

        this.socket.on("send.reservations.golfer.declined", function(data) {
            declined = data;
            console.log("declined");
            this.updateLists();
        });


    },

    domReady: function () {
        //this.socket.on("send.reservations.golfer.accepted", function(data) {
        //    accepted = data;
        //    console.log("accepted");
        //});
        //
        //this.socket.on("send.reservations.golfer.pending", function(data) {
        //    pending = data;
        //    console.log("pending");
        //});
        //
        //this.socket.on("send.reservations.golfer.declined", function(data) {
        //    declined = data;
        //    console.log("declined");
        //});
        //this.$.listAccepted.data = [{
        //    "name": "3 Golf 5 You",
        //    "cost": "87.50",
        //    "status": "Accepted",
        //    "date": "Mon, Jan 1",
        //    "time": "02:18"
        //},
        //    {"name": "Pro Golfer1", "cost": "32.25", "status": "Accepted", "date": "Wed, March 7", "time": "22:38"},
        //    {"name": "Pro Golfer2", "cost": "32.25", "status": "Accepted", "date": "Wed, March 7", "time": "22:38"},
        //    {"name": "Pro Golfer3", "cost": "32.25", "status": "Accepted", "date": "Wed, March 7", "time": "22:38"}];
        //
        //this.$.listPending.data = [{
        //    "name": "3 Golf 5 You",
        //    "cost": "87.50",
        //    "status": "Pending",
        //    "date": "Mon, Jan 1",
        //    "time": "02:18"
        //},
        //    {"name": "Pro Golfer1", "cost": "32.25", "status": "Pending", "date": "Wed, March 7", "time": "22:38"},
        //    {"name": "Pro Golfer2", "cost": "32.25", "status": "Pending", "date": "Wed, March 7", "time": "22:38"},
        //    {"name": "Pro Golfer3", "cost": "32.25", "status": "Pending", "date": "Wed, March 7", "time": "22:38"}];
        //
        //this.$.listDeclined.data = [{
        //    "name": "Rich Golfing",
        //    "cost": "1.35",
        //    "status": "Declined",
        //    "date": "Mon, Jan 1",
        //    "time": "23:18"
        //},
        //    {"name": "Golf Master", "cost": "2.34", "status": "Declined", "date": "Wed, March 7", "time": "16:42"}];

        if(accepted.length === 0) accepted.push({"name": "No accepted offers"});
        this.$.listAccepted.data = accepted;

        if(pending.length === 0) pending.push({"name": "No pending offers"});
        this.$.listPending.data = pending;

        if(declined.length === 0) declined.push({"name": "No declined offers"});
        this.$.listDeclined.data = declined;
    },

    updateLists: function() {
        this.$.listAccepted.data = accepted;
        this.$.listPending.data = pending;
        this.$.listDeclined.data = declined;
        console.log("updated list");
    },

    showResult: function () {
        console.log(event.detail);

        var data = event.detail.data;
        var dia = this.$.itemDialog;

        // Create data to populate paper-dialog
        var title, price, status, container;
        var att = document.createAttribute("class");
        //fake the user now
        //polymer is weird
        //not sure if this should even be here? maybe in a different scope?
        var user = {
            isAuthenticated: true,
            name: {
                "first":"David",
                "last": "Pate"
            },
            email: "david.pate@grimpy.com"
        };

        title = "<div style='font-weight: 600;font-size: 24px;padding-bottom: 20px;'>" + data.name + "</div>";
        price = "<div style='float: left;'>$" + data.cost + "</div>";
        status = "<div style='float: right;'>" + data.status + "</div>";
        container = "<div style='width: 300px;'>" + price + status + "</div>";

        if(user.isAuthenticated === true) {
            if(data.status === 'Accepted') {
                var button = "<paper-button raised style='margin-top: 25px; width: 100%; background-color: #03a9f4; color: white;' on-click='{{book}}'>BOOK NOW!</paper-button>";
                dia.innerHTML = title + container + button;
            } else {
                dia.innerHTML = title + container;
            }
        }
        else {
            var button = "<paper-button raised style='margin-top: 25px; width: 100%; background-color: #5c6bc0; color: white;' on-click='toggleLogin();'>YOU NEED TO LOGIN!</paper-button>";
            dia.innerHTML = title + container + button;
        }

        dia.open();


        //console.log(event.detail.item);
        //
        //if(event.detail.isSelected) {
        //    console.log("Selected to view: " + JSON.stringify(event.detail.item));
        //    this.$.itemDialog.open();
        //    event.detail.isSelected = false;
        //
        //} else {
        //    console.log("Selected to hide: " + JSON.stringify(event.detail.item));
        //}
    },

    book: function (event, detail, sender) {
        console.dir("booking.. " + JSON.stringify(this.listToBook));
    },

    updateList: function (e, detail, sender) {
        console.dir(e);
        console.dir(detail);
        console.dir(sender);

        console.log(sender.checked);

        var checkbox = sender.outerHTML;

        // Finding name
        var a = checkbox.indexOf("modelname");
        var b = checkbox.indexOf("\"", a);
        var c = checkbox.indexOf("\"", b + 1);
        var name = checkbox.substring(b + 1, c);

        // Finding date
        var a = checkbox.indexOf("modeldate");
        var b = checkbox.indexOf("\"", a);
        var c = checkbox.indexOf("\"", b + 1);
        var date = checkbox.substring(b + 1, c);

        // Finding time
        var a = checkbox.indexOf("modeltime");
        var b = checkbox.indexOf("\"", a);
        var c = checkbox.indexOf("\"", b + 1);
        var time = checkbox.substring(b + 1, c);

        // Finding cost
        var a = checkbox.indexOf("modelcost");
        var b = checkbox.indexOf("\"", a);
        var c = checkbox.indexOf("\"", b + 1);
        var cost = checkbox.substring(b + 1, c);

        if (sender.checked === true) {  // Add to list
            var j = {"cost": cost, "date": date, "time": time, "name": name};
            this.listToBook.push(j);
            console.dir(this.listToBook);
        } else {    // Remove from list
            for(var i = 0; i < this.listToBook.length; i++) {
                var cur = this.listToBook[i];
                if(cur.name === name && cur.date === date && cur.time === time && cur.cost === cost) {
                    this.listToBook.splice(i, 1);
                    break;
                }
            }

            console.dir(this.listToBook);
        }
    }

});