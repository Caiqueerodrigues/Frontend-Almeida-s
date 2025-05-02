<template>
  <div>
    <button @click="addTable">ADC Tabela</button>

    <div v-for="(table, tableIndex) in tables" :key="table.id" style="margin-top: 20px;">
      <h3>Tabela {{ tableIndex + 1 }}</h3>
      <button @click="addColumn(tableIndex)">ADC Coluna</button>
      <button @click="addRow(tableIndex)">ADC Linha</button>

      <table border="1" style="margin-top: 10px;">
        <tr>
          <th v-for="(col, colIndex) in table.columns" :key="colIndex">
            Coluna {{ colIndex + 1 }}
          </th>
        </tr>
        <tr v-for="(row, rowIndex) in table.rows" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex">
            {{ cell }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tables = ref([])

function addTable() {
  tables.value.push({
    id: Date.now() + Math.random(),
    columns: [ '' ], // começa com uma coluna
    rows: [ [ '' ] ] // começa com uma linha e uma célula
  })
}

function addColumn(tableIndex) {
  const table = tables.value[tableIndex]
  table.columns.push('')
  table.rows.forEach(row => row.push(''))
}

function addRow(tableIndex) {
  const table = tables.value[tableIndex]
  const newRow = table.columns.map(() => '')
  table.rows.push(newRow)
}
</script
