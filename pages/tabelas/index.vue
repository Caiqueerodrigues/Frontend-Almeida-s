<template>
  <v-form ref="form">
    <v-row class="justify-center">
      <v-col cols="12" md="7" class="mt-4">
        <v-select
            chips
            label="Selecione o cliente"
            v-model="dados.cliente"
            :items="clientes"
            item-title="nome"
            item-value="id"
            variant="outlined"
            rounded="xl"
        ></v-select>
      </v-col>
      <v-col cols="12" class="text-center" v-if="dados.cliente">
        <v-btn variant="flat" color="success" rounded="xl" @click="addTable">
          <v-icon class="mr-2">
            mdi-plus
          </v-icon>
          CRIAR TABELA
          <v-icon class="ml-2">
            mdi-table-plus
          </v-icon>
        </v-btn>
        
      </v-col>
      <v-col cols="12" class="text-center" v-if="dados.cliente">
        <v-btn variant="flat" class="ml-3" color="success" rounded="xl" @click="getTables()">
          <v-icon class="mr-2">
            mdi-table
          </v-icon>
          BUSCAR TABELAS
        </v-btn>
      </v-col>

      <v-col cols="12" class="text-center mt-14" v-if="dados.tables.length === 0">
        <h2 class="text-secondary pt-14">
          NÃO EXISTEM DADOS PARA MOSTRAR
        </h2>
      </v-col>
      
      <v-col cols="12" md="7" v-for="(table, tableIndex) in dados.tables" :key="table.id" class="text-center">
        <v-text-field
          v-capitalize-first
          v-model="table.nome"
          rounded="xl"
          variant="outlined"
          label="Nome da tabela"
          class="mb-2"
          :rules="[(value) => !!value || 'O nome é obrigatório!']"
        ></v-text-field>
        
        <div class="ma-0" v-for="(column, index) in table.columns" :key="index">
          <v-text-field
            v-capitalize-first
            v-if="column.key !== 'actions'"
            v-model="column.title"
            rounded="xl"
            variant="outlined"
            label="Nome da coluna"
            class="mb-2"
            :rules="[(value) => !!value || 'O nome é obrigatório!']"
            append-icon="mdi-close"
            @click:append="table.columns.splice(index, 1)"
          ></v-text-field>
        </div>

        <v-col cols="12" md="6">
          <v-btn variant="flat" color="success" rounded="xl" class="ma-2" @click="addColumn(tableIndex)">ADC Coluna</v-btn>

          <v-btn variant="flat" color="success" rounded="xl" class="ma-2" @click="addRow(tableIndex)">ADC Linha</v-btn>
        </v-col>
        
        <v-row class="ma-0">
          <v-col cols="12" md="6">
            <VueDatePicker 
              v-model="table.createdAt" 
              range 
              autoApply
              locale="pt-BR"
              dark
              :disabled="true"
            />
          </v-col>
          <v-col cols="12" md="6" v-if="table.updatedAt">
            <VueDatePicker 
              v-model="table.updatedAt" 
              range 
              autoApply
              locale="pt-BR"
              dark
              :disabled="true"
            />
          </v-col>
        </v-row>
        <div class="position-relative">
          <v-icon size="30" class="closeButtonTable cursor-pointer" @click="deleteTable(tableIndex)">
            mdi-close
          </v-icon>
          <v-data-table-virtual
            class="bg-secondary rounded-xl text-black"
            :headers="table.columns"
            :items="table.rows"
            item-value="nome"
            :no-data-text="'Sem dados para mostrar'"
          >
            <template v-for="col in table.columns" #[`item.${col.key}`]="{ item, index }" :key="col.key">
              <v-text-field
                v-capitalize-first
                v-if="col.key !== 'actions'"
                v-model="table.rows[index][col.key]"
                variant="outlined"
                rounded="xl"
                density="compact"
                class="pa-0 my-1"
                :rules="[(value) => !!value || 'O campo é obrigatório!']"
              />
              
              <v-icon
                v-if="col.key === 'actions'"
                size="30"
                color="white"
                class="cursor-pointer mb-4"
                @click="deleteRow(tableIndex, index)"
              >
                mdi-close
              </v-icon>
            </template>
          </v-data-table-virtual>
        </div>
      </v-col>

      <v-col cols="12" class="text-center" v-if="dados.tables.length > 0">
        <v-btn 
          variant="outlined" 
          color="secondary" 
          rounded="xl" 
          class="ma-2" 
          @click="clear()"
        >
          LIMPAR
        </v-btn>
        <v-btn 
          variant="flat" 
          color="success" 
          rounded="xl" 
          class="ma-2" 
          @click="submit()"
        >
          SALVAR
        </v-btn>
        <!-- <v-btn
          variant="flat" 
          color="success" 
          rounded="xl" 
          class="ma-2"
        >
          IMPRIMIR
        </v-btn> -->
      </v-col>
    </v-row>
  </v-form>
</template>
<script setup>
  import { formatteDateBrasilia, generateIdRandom } from '~/services/helpers';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';

  const axios = inject('axios');
  const validateForm = inject('validateForm');

  const form = ref(null);
  const dados = ref({
    cliente: null,
    idsDeletados: [],
    tables: []
  });
  const clientes = ref([]);
  const clientesCompletos = ref([]);

  const addTable = () => {
    dados.value.tables.unshift({
      id: generateIdRandom(6, true),
      nome: '',
      isNew: true,
      createdAt: new Date(), //formatteDateBrasilia(new Date(), false),
      columns: [ 
        { title: 'Nova coluna', align: 'center', key: '1' },
        { title: 'Ações', align: 'center', key: 'actions', sortable: false, width: '50px' }
      ],
      rows: [ { nome: '', actions: '' } ]
    })
  }

  const getTables = async () => {
    await axios.get(`tables/${typeof dados.value.cliente === 'number' ? dados.value.cliente : dados.value.cliente.id}`).then(response => {
      if(response.length && response.length > 0) {
        dados.value.tables = [];

        if(typeof dados.value.cliente !== 'number') dados.value.cliente = dados.value.cliente.id;

        response.forEach(item => {
          const tabelasArray = JSON.parse(item.tabelas);
          
          if(tabelasArray.length > 0) {
            tabelasArray.forEach(tabela => {
              tabela.isNew = false;
              tabela.id = item.id;
              tabela.createdAt = formatteDateBrasilia(new Date(item.createdAt), false);
              if(item.updatedAt) tabela.updatedAt = formatteDateBrasilia(new Date(item.updatedAt), false);
              if(!dados.value.tables.some(tab => tab.id === item.id)) dados.value.tables.push(tabela);
            })
          } else {
            tabelasArray.id = item.id;
            tabelasArray.isNew = false;
            tabelasArray.createdAt = formatteDateBrasilia(new Date(item.createdAt), false);
            if(item.updatedAt) tabelasArray.updatedAt = formatteDateBrasilia(new Date(item.updatedAt), false);
            if(!dados.value.tables.some(tab => tab.id === item.id)) dados.value.tables.push(tabelasArray);
          }
        });
      }
    }).catch(e => console.error(e));
  }

  const getClientes = async () => {
    await axios.get('clients/active').then(response => {
      clientesCompletos.value = response;
        response.map(item => {
          clientes.value.push({ id: item.id, nome: item.nome });
        });
    }).catch(e => console.error(e));
  }

  const addColumn = (tableIndex) => {
    const table = dados.value.tables[tableIndex];
    const newKey = `col${table.columns.length}`;
    
    table.columns.splice(table.columns.length - 1, 0, {
      title: 'Nova coluna',
      align: 'center',
      key: newKey
    });

    table.rows.forEach(row => {
      row[newKey] = '';
  });
  }

  const addRow = (tableIndex) => {
    const table = dados.value.tables[tableIndex];
    const newRow = {};

    table.columns.forEach(col => {
      if (col.key !== 'actions') {
        newRow[col.key] = '';
      }
    });

    newRow.actions = '';
    table.rows.push(newRow);
  }

  const deleteTable = (tableIndex) => {
    if(typeof dados.value.tables[tableIndex].id !== 'string') {
      dados.value.idsDeletados.push(dados.value.tables[tableIndex].id);
    } 
    dados.value.tables.splice(tableIndex, 1);
  }

  const deleteRow = (tableIndex, rowIndex) => {
    const table = dados.value.tables[tableIndex];
    table.rows.splice(rowIndex, 1);
  }

  const clear = () => {
    dados.value = {
      cliente: null,
      tables: [],
      isNew: true,
      idsDeletados: []
    };
  }

  const submit = async () => {
    const errors = await validateForm(form);
    if(errors.valid) {
      dados.value.cliente = clientesCompletos.value.find(cliente => cliente.id === dados.value.cliente);

      axios.post('/tables', dados.value).then(response => {
        getTables();
      }).catch(e => console.error(e));
    }
  }

  onMounted(() => {
    getClientes();
  })
</script>
<style scoped>
  .closeButtonTable {
    position: absolute;
    top: -8px;
    right: -8px;
    color: #fff;
    cursor: pointer;
  }

  :deep(.dp__input) {
    background-color: #A60014;
    border-radius: 20px;
    border-color: #eeff00;
    color: #eeff00;
    font-weight: bold;
  }

    :deep(.dp__menu) {
      border-radius: 20px;
      border-color: #eeff00;
      font-weight: bold;
      padding-bottom: 20px;
    }
</style>