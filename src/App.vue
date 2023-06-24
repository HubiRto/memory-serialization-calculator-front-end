<script setup></script>

<template>
  <div class="container">
    <header>Szeregowanie komórek pamięci</header>
    <form class="form">
      <div class="column">
        <div class="input-box">
          <input type="number" id="processCount" v-model="processCount" placeholder="Ilość procesów"
                 @change="initializeFormData" required>
        </div>
        <div class="select-box">
          <select id="algorithm" v-model="algorithm">
            <option value="FIFO">FIFO</option>
            <option value="ROUND_ROBIN">Round Robin</option>
            <option value="SFJ">SFJ</option>
            <option value="SRFT">SRFT</option>
          </select>
        </div>
      </div>
    </form>

    <form class="form">
      <div class="column" v-if="algorithm === 'ROUND_ROBIN'">
        <div class="input-box">
          <input type="number" id="quantum" placeholder="Liczba kwantów" v-model="quantum" required>
        </div>

        <div class="select-box">
          <select id="order" v-model="order">
            <option value="PO">PO</option>
            <option value="PRZED">PRZED</option>
          </select>
        </div>
      </div>
    </form>

    <form class="form" @submit.prevent="submitData">
      <div class="process" v-for="index in processCount" :key="index">
        <div class="column">
          <div class="input-box">
            <label>Proces P{{ index - 1 }}</label>
            <input type="number" v-model="formData[index].arrivalTime" placeholder="Czas przybycia" required>
          </div>
          <div class="input-box">
            <br>
            <input type="number" v-model="formData[index].executionTime" placeholder="Czas wykonania" required>
          </div>
        </div>
      </div>

      <button type="submit">Oblicz</button>
    </form>

    <table v-if="result">
      <tbody>
      <tr v-for="(row, index) in result" :key="index">
        <td>P{{ index }}</td>
        <td v-for="(value, valueIndex) in row" :key="valueIndex">
          {{ (valueIndex === row.length - 3) ? ' ' + value : value }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      processCount: null,
      algorithm: 'FIFO',
      quantum: null,
      order: 'PO',
      formData: {},
      result: null,
    };
  },
  methods: {
    initializeFormData() {
      this.formData = {};
      for (let i = 1; i <= this.processCount; i++) {
        this.formData[i] = {
          index: i - 1,
          arrivalTime: null,
          executionTime: null,
        };
      }
    },
    submitData() {
      const data = Object.values(this.formData);

      if (this.algorithm === 'ROUND_ROBIN') {
        // Dodaj dane specyficzne dla Round Robin do obiektu danych
        data.forEach((processData) => {
          processData.quantum = this.quantum;
          processData.order = this.order;
        });
      }

      fetch('http://localhost:8080/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
          .then(response => response.json())
          .then(result => {
            this.result = result;
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
  },
};
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
  color: #181818;
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  background: rgb(130, 106, 251);
}

.container {
  position: relative;
  max-width: 700px;
  width: 100%;
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 0 15px rgb(0, 0, 0, 0.1);
}

.container header {
  font-size: 1.5rem;
  color: #333;
  font-weight: 500;
  text-align: center;
}

.container .form {
  margin-top: 30px;
}

.form :where(.input-box input, .select-box) {
  width: 100%;
  margin-top: 20px;
}

.input-box label {
  color: #333;
}

.form :where(.input-box input, .select-box) {
  position: relative;
  height: 35px;
  width: 100%;
  outline: none;
  font-size: 1rem;
  color: #707070;
  margin-top: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0 15px;
}

.select-box select {
  height: 100%;
  width: 100%;
  outline: none;
  border: none;
  color: #707070;
  font-size: 1rem;
}

.form .column {
  display: flex;
  column-gap: 15px;
}

.form button {
  height: 45px;
  width: 100%;
  color: white;
  font-size: 1rem;
  border: none;
  margin-top: 30px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 400;
  background-color: rgb(130, 106, 251);
}

</style>

