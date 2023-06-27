<template>
  <body>
  <div class="container">
    <header>Szeregowanie komórek pamięci</header>
    <form class="form">
      <div class="column">
        <div class="input-box">
          <input
              type="number"
              id="processCount"
              v-model="processCount"
              placeholder="Ilość procesów"
              @change="initializeFormData"
              required
          />
        </div>
        <div class="select-box">
          <select id="algorithm" v-model="algorithm" @change="onAlgorithmChange">
            <option value="FIFO">FIFO</option>
            <option value="ROUND_ROBIN">Round Robin</option>
            <option value="SFJ">SJF</option>
            <option value="SRFT">SRTF</option>
          </select>
        </div>
      </div>
    </form>

    <form class="form">
      <div class="column" v-if="algorithm === 'ROUND_ROBIN'">
        <div class="input-box">
          <input
              type="number"
              id="quantum"
              placeholder="Liczba kwantów"
              v-model="quantum"
              required
          />
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
            <input
                type="number"
                v-model="formData[index].arrivalTime"
                placeholder="Czas przybycia"
                required
            />
          </div>
          <div class="input-box">
            <br/>
            <input
                type="number"
                v-model="formData[index].executionTime"
                placeholder="Czas wykonania"
                required
            />
          </div>
        </div>
      </div>

      <button type="submit">Oblicz</button>
    </form>

    <div class="tables" v-if="result && timeResult">
      <div class="table" style="width: 60%">
        <table>
          <tbody>
          <tr v-for="(row, index) in result" :key="index">
            <td style="width: 10%">P{{ index }}</td>
            <td
                v-for="(value, valueIndex) in row"
                :key="valueIndex"
                :class="getBackgroundColorClass(value)"
            >
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="table" style="width: 40%">
        <table>
          <tbody>
          <tr v-for="(row, index) in timeResult" :key="index" :class="{ blue: index === timeResult.length - 1 }">
            <td v-for="(value, valueIndex) in row" :key="valueIndex">
              {{ value }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  </body>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  mounted() {
    let token=localStorage.getItem("token");
    console.log(token);
    axios
        .get("http://localhost:8080/api/v1/demo-controller", {
          headers: {
            "Authorization" : `Bearer ${token}`,
            token: token
          }
        })
        .then(res => {
          console.log(res);
        });
  },
  data() {
    return {
      processCount: null,
      algorithm: 'FIFO',
      quantum: null,
      order: 'PO',
      formData: {},
      result: null,
      timeResult: null,
      backendUrls: {
        FIFO: 'http://localhost:8080/api/fifo',
        ROUND_ROBIN: 'http://localhost:8080/api/round-robin',
        SFJ: 'http://localhost:8080/api/sjf',
        SRFT: 'http://localhost:8080/api/srtf',
      },
    };
  },
  methods: {
    getBackgroundColorClass(value) {
      if (value === 1) {
        return 'red'; // klasa CSS dla wartości 1 (czerwony)
      } else if (value === 2) {
        return 'green'; // klasa CSS dla wartości 2 (zielony)
      } else {
        return ''; // pusta klasa CSS dla pozostałych wartości
      }
    },
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
    onAlgorithmChange() {
      if (this.algorithm !== 'ROUND_ROBIN') {
        this.quantum = null;
        this.order = 'PO';
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

      let apiUrl = this.backendUrls[this.algorithm];

      if (this.algorithm === 'FIFO') {
        apiUrl = this.backendUrls.FIFO;
      }

      axios
          .post(apiUrl, data)
          .then((response) => {
            this.result = response.data.ints;
            this.timeResult = response.data.doubles;
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    },

  },
};
</script>
<style scoped>

* {
  font-family: "Poppins", sans-serif;
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

table, th, td {
  border: 1px solid black;
}

tr {
  text-align: center;
}


.tables {
  margin-top: 10px;
  width: 100%;
  display: flex;
  column-gap: 15px;
}

.tables table {
  position: relative;
  width: 100%;
}

.red {
  background-color: #D1696A;
}

.green {
  background-color: #82C49E;
}

.blue {
  background-color: #B0AFFF;
  color: white;
}

.offset-row {
  margin-top: 20px;
}

</style>

