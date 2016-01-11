function $(id) {
    if (id) {
        if (window === this) {
            return new $(id);
        }
        this.e = document.getElementById(id);
        return this;
    }
}

$.prototype = {
    html: function (text) {
        return (arguments.length == 0) ? this.e.innerHTML : this.e.innerHTML = text;
    }
};