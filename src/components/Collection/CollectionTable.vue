<template>
  <div>
    <v-data-table
      v-model="selected"
      class="card elevation-1"
      :headers="headers"
      :search="search"
      :items="numbers"
      item-key="number"
      show-select
      :items-per-page="10"
    >
      <template v-slot:top>
        <v-toolbar class="card" flat>
          <v-toolbar-title>Collection Of Numbers</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            class="mx-4 mt-6"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            class="mr-2"
            v-bind="attrs"
            @click="exportContacts"
          >
            Export
          </v-btn>

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                color="primary"
                class="mr-2"
                v-bind="attrs"
                v-on="on"
              >
                New
              </v-btn>
            </template>
            <v-card color="card">
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.number"
                        label="Number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-switch
                        v-model="editedItem.verified"
                        inset
                        :label="`Verified?`"
                      ></v-switch>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="close"> Cancel </v-btn>
                <v-btn color="primary" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDeleteContacts" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                color="primary"
                class="mr-2"
                v-bind="attrs"
                v-on="on"
              >
                Delete
              </v-btn>
            </template>
            <v-card color="card">
              <v-card-title class="headline"
                >Sure you want to delete selected contacts?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="dialogDeleteContacts = false"
                  >Cancel</v-btn
                >
                <v-btn color="primary" text @click="deleteContactsConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card color="card">
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="primary" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item, isSelected, select, index }">
        <tr
          :class="isSelected ? 'secondary' : ''"
          class="pl-4"
          @click="toggle(isSelected, select, $event)"
        >
          <td>{{ index + 1 }}</td>
          <td class="d-flex align-center">
            {{ item.name }}
            <v-icon class="px-1" color="white" v-if="isSelected"
              >mdi-check</v-icon
            >
          </td>
          <td>{{ item.number }}</td>
          <td>
            <v-icon :color="getColor(item.verified)">
              {{ item.verified ? 'mdi-checkbox-marked' : 'mdi-minus-box' }}
            </v-icon>
          </td>
          <td>
            <v-icon
              small
              color="primary"
              class="mr-2"
              @click.stop="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon small color="error" @click.stop="deleteItem(item)">
              mdi-delete
            </v-icon>
          </td>
        </tr>
      </template>
      <!-- <template v-slot:item.actions="{ item }">

      </template> -->
    </v-data-table>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'CollectionTable',
  props: {
    collection: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      dialogDeleteContacts: false,
      selected: [],
      search: '',
      headers: [
        // {
        //   text: '#',
        //   align: 'start',
        //   sortable: false,
        //   value: 'name',
        // },
        {
          text: 'Name',
          sortable: false,
          value: 'name',
        },
        // { text: 'Keyword', value: 'keyword' },
        // { text: 'Comment', value: 'comment' },
        { text: 'Number', value: 'number', sortable: false },
        { text: 'Verified?', value: 'verified' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      numbers: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        number: '',
        isMyContact: false,
        verified: false,
      },
      defaultItem: {
        name: '',
        number: '',
        isMyContact: false,
        verified: false,
      },
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  created() {
    this.initialize()
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
  methods: {
    getColor(status) {
      if (status) return 'primary'
      if (!status) return 'error'
      else return 'info'
    },
    initialize() {
      this.numbers = this.collection.numbers
    },
    editItem(item) {
      this.editedIndex = this.numbers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.numbers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.numbers.splice(this.editedIndex, 1)
      const newCollection = Object.assign({}, this.collection)
      newCollection.numbers = this.numbers
      this.$emit('change', newCollection)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.numbers[this.editedIndex], this.editedItem)
      } else {
        this.numbers.push(this.editedItem)
      }
      const newCollection = Object.assign({}, this.collection)
      newCollection.numbers = this.numbers
      this.$emit('change', newCollection)
      this.close()
    },
    exportContacts() {
      let expContacts = Object.assign([], this.numbers)
      expContacts = expContacts.map((contact) => {
        let cont = ''
        for (const property in contact) {
          if (property === 'name' || property === 'number') {
            cont += `${contact[property]},`
          }
          if (property === 'verified' && contact[property] === true) {
            cont += `isVerified,`
          } else if (property === 'verified' && contact[property] === false) {
            cont += `notVerified,`
          }
        }
        return cont
      })
      // console.log(JSON.stringify(expContacts))
      let stringContacts = ''
      expContacts.forEach((contact) => {
        stringContacts += contact + '\n'
      })
      ipcRenderer.send('export-contacts', { contacts: stringContacts })
    },
    toggle(isSelected, select) {
      console.log(isSelected)
      select(!isSelected)
    },
    deleteContactsConfirm() {
      const numbers = this.selected
      if (!numbers.length) return
      let number
      for (let i = 0; i < numbers.length; i++) {
        number = numbers[i]
        const editedIndex = this.numbers.findIndex((o) => o.id === number.id)
        if (editedIndex !== -1) this.numbers.splice(editedIndex, 1)
      }
      const newCollection = Object.assign({}, this.collection)
      newCollection.numbers = this.numbers
      this.$emit('change', newCollection)
      this.dialogDeleteContacts = false
    },
  },
}
</script>

<style></style>
