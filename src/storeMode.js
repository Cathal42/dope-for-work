export default {
    state: {
        hasLeftArrow: false
    },
    showLeftArrow() {
        this.state.hasLeftArrow = true;
    },
    hideLeftArrow() {
        this.state.hasLeftArrow = false;
    }
}