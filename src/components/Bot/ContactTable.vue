<template>
  <div>
    <v-data-table
      v-model="selected"
      class="card"
      :headers="headers"
      :search="search"
      :items="leads"
      item-key="number"
      show-select
      :items-per-page="20"
    >
      <template v-slot:top>
        <v-toolbar class="card" flat>
          <v-toolbar-title>Contacts Data</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            class="mx-4 mt-6"
          ></v-text-field>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialogContacts" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                color="primary"
                class="mr-2"
                v-bind="attrs"
                v-on="on"
              >
                Import
              </v-btn>
            </template>
            <v-card color="card">
              <v-card-title>
                <span class="headline">Import Contacts</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <AppUpload
                        :label="'Upload a file of contacts'"
                        :hint="'Upload a list of contacts to this campaign'"
                        @input="importContacts"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="closeContacts"> Close </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
                color="primary"
                small
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
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="editedItem.isMyContact"
                        label="Contact"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="editedItem.isBusiness"
                        label="WA-Contact"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="editedItem.isWAContact"
                        label="WA-Contact"
                      ></v-text-field>
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
            <v-icon :color="getColor(item.isMyContact)">
              {{ item.isMyContact ? 'mdi-checkbox-marked' : 'mdi-minus-box' }}
            </v-icon>
          </td>
          <td>
            <v-chip
              class="ma-2"
              :color="getType(item.isBusiness)"
              label
              outlined
            >
              {{ item.isBusiness ? 'Business' : 'Personal' }}
            </v-chip>
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
      <template v-slot:item.actions="{ item }">
        <v-icon small color="primary" class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small color="error" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'
import { nanoid } from 'nanoid'
const fs = require('fs')
export default {
  name: 'DashboardTable',
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      dialogContacts: false,
      dialogDeleteContacts: false,
      isContact: '',
      wa_type: '',
      selected: [],
      search: '',
      wa_types: ['All', 'Business', 'Personal'],
      isContacts: ['All', 'Contact', 'Not contact'],
      headers: [
        // {
        //   text: '#',
        //   align: 'start',
        //   sortable: false,
        //   value: 'index',
        // },
        {
          text: 'Name',
          sortable: false,
          value: 'name',
        },
        // { text: 'Keyword', value: 'keyword' },
        // { text: 'Comment', value: 'comment' },
        { text: 'Number', value: 'number', sortable: false },
        { text: 'Contact', value: 'isMyContact' },
        { text: 'WhatsApp', value: 'isBusiness' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      leads: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        number: '',
        isMyContact: false,
        isBusiness: false,
        isWAContact: false,
      },
      defaultItem: {
        name: '',
        number: '',
        isMyContact: false,
        isBusiness: false,
        isWAContact: false,
      },
    }
  },
  computed: {
    ...mapGetters({
      contacts: 'campaign/contacts',
      activeVerificationGroup: 'app/activeVerificationGroup',
      currentCampaign: 'campaign/currentCampaign',
    }),
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
    dialogContacts(val) {
      val || this.closeContacts()
    },
    contacts(newValue) {
      if (newValue) this.initialize()
    },
  },
  methods: {
    getColor(status) {
      if (status) return 'primary'
      if (!status) return 'error'
      else return 'info'
    },
    getType(status) {
      if (status) return 'info'
      if (!status) return 'primary'
      else return 'info'
    },

    initialize() {
      this.leads = this.contacts.filter(
        (contact) => contact.campaignId === this.currentCampaign.id,
      )
    },

    editItem(item) {
      this.editedIndex = this.leads.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      console.log('Delete item is called')
      this.editedIndex = this.leads.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.$store.commit('campaign/DELETE_CONTACT', this.editedItem)
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

    closeContacts() {
      this.dialogContacts = false
    },

    save() {
      if (this.editedIndex > -1) {
        this.$store.commit('campaign/EDIT_CONTACT', this.editedItem)
      } else {
        const contact = Object.assign({}, this.editedItem)
        contact.id = nanoid()
        this.$store.commit('campaign/ADD_CONTACT', contact)
      }
      this.close()
    },
    toggle(isSelected, select) {
      select(!isSelected)
    },
    exportContacts() {
      let expContacts = Object.assign([], this.leads)
      expContacts = expContacts.map((contact) => {
        let cont = ''
        for (const property in contact) {
          if (property === 'name' || property === 'number') {
            cont += `${contact[property]},`
          }
          if (property === 'isBusiness' && contact[property] === true) {
            cont += `isBusiness,`
          } else if (property === 'isBusiness' && contact[property] === false) {
            cont += `notBusiness,`
          }
          if (property === 'isMyContact' && contact[property] === true) {
            cont += `isMyContact,`
          } else if (
            property === 'isMyContact' &&
            contact[property] === false
          ) {
            cont += `notMyContact,`
          }
          if (property === 'isWAContact' && contact[property] === true) {
            cont += `isWAContact,`
          } else if (
            property === 'isWAContact' &&
            contact[property] === false
          ) {
            cont += `notWAContact , `
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
    importContacts(file) {
      if (!file) return

      const textContent = fs.readFileSync(file.path).toString()

      let contacts = textContent.split('\n')
      if (!contacts.slice(-1)[0]) contacts.pop()
      const arrOfContacts = contacts.map((contact) => {
        const contactArr = contact.split(',')
        if (!contactArr.slice(-1)[0]) contactArr.pop()

        const campaignId = this.currentCampaign.id
        const id = nanoid()

        let isWAContact = false
        let isMyContact = false
        let isBusiness = false

        let contactObj = {
          id,
          campaignId,
          name: 'n/a',
          isWAContact,
          isMyContact,
          isBusiness,
        }

        for (let i = 0; i < contactArr.length; i++) {
          if (contactArr[i] === 'isWAContact') {
            isWAContact = true
            contactObj.isWAContact = isWAContact
          } else if (contactArr[i] === 'notWAContact') {
            isWAContact = false
            contactObj.isWAContact = isWAContact
          } else if (contactArr[i] === 'isMyContact') {
            isMyContact = true
            contactObj.isMyContact = isMyContact
          } else if (contactArr[i] === 'notMyContact') {
            isMyContact = false
            contactObj.isMyContact = isMyContact
          } else if (contactArr[i] === 'isBusiness') {
            isBusiness = true
            contactObj.isBusiness = isBusiness
          } else if (contactArr[i] === 'notBusiness') {
            isBusiness = false
            contactObj.isBusiness = isBusiness
          } else if (!isNaN(parseInt(contactArr[i])))
            contactObj.number = contactArr[i]
          else if (isNaN(parseInt(contactArr[i])))
            contactObj.name = contactArr[i]
        }
        return contactObj
      })

      this.$store.commit('campaign/IMPORT_CONTACTS', arrOfContacts)
      this.dialogContacts = false
    },
    deleteContactsConfirm() {
      if (!this.selected.length) return
      this.$store.commit('campaign/DELETE_CONTACTS', this.selected)
      this.dialogDeleteContacts = false
    },
  },
}
</script>

<style></style>
