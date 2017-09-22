var app = new Vue({
    el: "#app",
    data: {
        search: "",
        onlyProduction: true,
        activeModal: "",
        hasContent: false,
        versions: [],
        sortField: "created",
        sortOrder: false
    },
    mounted: function() {
        this.loadSettings();
    },
    watch: {
        onlyProduction: function(oldVal, newVal) {
            this.loadFetch(this.search);
        }
    },
    methods: {
        getPackageVersion: function(item, package) {
            let matches = item.packages.filter(function(x) {
                return x.name.toLowerCase() === package.toLowerCase();
            });

            if (!matches.length) {
                return "?";
            }

            return matches[0].version;
        },
        timeFromNow: function(e) {
            return moment(e, "X").fromNow();
        },
        showDetailed: function(e) {
            this.activeModal = e;
        },
        hideDetailed: function(e) {
            this.activeModal = "";
        },
        loadSettings: function(cb) {
            var self = this;
            fetch("conf.json", {
                method: "get"
            })
                .then(function(response) {
                    return response.json();
                })
                .then(function(json) {
                    self.apiKey = json.apiKey;
                    self.endpoint = json.endpoint;
                    self.loadFetch(self.search);
                })
                .catch(function(err) {
                    console.log(err);
                });
        },
        applySortingClass: function(field) {
            if (this.sortField !== field) {
                return "";
            }

            return "sorted " + (this.sortOrder ? "ascending" : "descending");
        },
        changeSorting: function(field, order) {
            field = field || "created";
            order = !this.sortOrder;

            this.sortField = field;
            this.sortOrder = order;

            this.updateSorting(this.versions, field, order);
        },
        updateSorting: function(items, field, order) {
            field = field || this.sortField;
            order = order || this.sortOrder;

            items = items.sort(function(a, b) {
                let valueA = a[field];
                let valueB = b[field];

                if (valueA < valueB) {
                    return order ? -1 : 1;
                }
                if (valueA > valueB) {
                    return order ? 1 : -1;
                }
                return 0;
            });

            return items;
        },
        loadFetch: function(search) {
            var branch = this.onlyProduction ? "master" : "";
            var self = this;

            fetch(
                self.endpoint + "?package=" + this.search + "&branch=" + branch,
                {
                    method: "get",
                    headers: new Headers({
                        "x-api-key": self.apiKey
                    })
                }
            )
                .then(function(response) {
                    return response.json();
                })
                .then(function(json) {
                    self.versions = self.updateSorting(json);
                    self.hasContent = json.length > 0;
                })
                .catch(function(err) {
                    console.log(err);
                });
        },
        submit: function(value) {
            this.loadFetch(this.search);
        }
    }
});
