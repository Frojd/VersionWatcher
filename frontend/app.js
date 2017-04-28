var app = new Vue({
    el: '#app',
    data: {
        search: '',
        onlyProduction: true,
        activeModal: '',
        hasContent: false,
        versions: [],
    },
    mounted: function () {
        this.loadSettings();
    },
    watch: {
        onlyProduction: function(oldVal, newVal) {
            this.loadFetch(this.search);
        }
    },
    methods: {
        showDetailed: function(e) {
            this.activeModal = e;
        },
        hideDetailed: function(e) {
            this.activeModal = '';
        },
        loadSettings: function(cb) {
            var self = this;
            fetch('conf.json', {
                method: 'get'
            }).then(function(response) {
                return response.json();
            }).then(function(json) {
                self.apiKey = json.apiKey;
                self.endpoint = json.endpoint;
                self.loadFetch(self.search);
            }).catch(function(err) {
                console.log(err);
            });
        },
        loadFetch: function(search) {
            var branch = this.onlyProduction ? 'master' : '';
            var self = this;
            fetch(self.endpoint+'?package='+this.search+'&branch='+branch, {
                method: 'get',
                headers: new Headers({
                    'x-api-key': self.apiKey,
                }),
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
