var endpoint = 'https://ei5v6h5fz6.execute-api.eu-west-1.amazonaws.com/stage/tracker/stable';

var app = new Vue({
    el: '#app',
    data: {
        search: '',
        activeModal: '',
        hasContent: false,
        versions: [
        ],
    },
    mounted: function () {
        this.loadFetch(this.search);
    },
    methods: {
        showDetailed: function(e) {
            this.activeModal = e;
        },
        hideDetailed: function(e) {
            this.activeModal = '';
        },
        loadFetch: function(search) {
            var self = this;
            fetch(endpoint+'?package='+this.search, {
                method: 'get',
            }).then(function(response) {
                return response.json();
            }).then(function(json) {
                self.versions = json;
                self.hasContent = json.length > 0;
            }).catch(function(err) {
                console.log(err);
            });
        },
        submit: function(value) {
            this.loadFetch(this.search);
        }
    }
})
