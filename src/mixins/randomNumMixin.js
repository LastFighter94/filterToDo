export default {
  methods: {
    randomNumMixin(min, max){
      let rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand);
    }
  }
}