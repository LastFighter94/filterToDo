<template>
  <div class="page">
    <h1>
      Not Found
    </h1>

    Пожалуйста введите корректный адрес

    <p>
      <router-link
          to="/"
      >
        Вернуться на главную
      </router-link>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.page {
  text-align: center;
  padding: 10px;
  margin: 10px;
}

a {
  color: rgba(0, 0, 0, 0.5);
}

a:hover {
  color: rgb(0, 0, 0);
}

</style>
