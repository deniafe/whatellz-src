<template>
  <v-dialog v-model="push" overlay-color="black" width="600" persistent>
    <v-card color="card">
      <v-card-title>All WhatsApp Groups</v-card-title>
      <div
        class="pa-4"
        style="overflow: scroll; height: 500px; background-color: #1e3530'"
      >
        <v-data-table
          v-model="selected"
          class="card elevation-0"
          :headers="headers"
          :items="groups"
          item-key="id"
          :items-per-page="1000"
        >
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
              <td>{{ item.members }}</td>
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
                  @click.stop="saveItem(item)"
                  v-if="!isSelected"
                >
                  mdi-content-save-outline
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
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="closeDialog"> Close </v-btn>
        <v-btn color="primary" text @click="saveGroups"> Save All </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'WaGrpDisplayDialog',
  data() {
    return {
      selected: [],
      expanded: [],
      dialogDelete: false,
      headers: [
        {
          text: '#',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Group Name',
          sortable: false,
          value: 'name',
        },
        // { text: 'Keyword', value: 'keyword' },
        // { text: 'Comment', value: 'comment' },
        { text: 'Members', value: 'members', sortable: false },
        { text: 'Verified?', value: 'verified', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters({
      waTempGroups: 'app/waTempGroups',
      numberGroups: 'app/numberGroups',
      waGrpDisplayDialog: 'app/waGrpDisplayDialog',
    }),
    push: {
      get() {
        return this.waGrpDisplayDialog
      },
      set(val) {
        this.$store.commit('app/SET_WA_GRP_DISPLAY_DIALOG', val)
      },
    },
    groups() {
      const groups = Object.assign([], this.waTempGroups)
      const newGroups = groups.map((group) => {
        group.members = group.numbers.length
        return group
      })
      // groups.members = this.waNumberGroups.groups.length
      return newGroups
    },
  },
  methods: {
    closeDialog() {
      this.$store.commit('app/SET_WA_GRP_DISPLAY_DIALOG', false)
    },
    getColor(status) {
      if (status) return 'primary'
      if (!status) return 'error'
      else return 'info'
    },
    // toggle(isSelected, select) {
    //   select(!isSelected)
    // },
    // deleteItem(item) {
    //   this.editedIndex = this.groups.indexOf(item)
    //   this.editedItem = Object.assign({}, item)
    //   this.dialogDelete = true
    // },
    deleteItem(item) {
      console.log('Item about to be deleted')
      const editedIndex = this.groups.indexOf(item)
      this.groups.splice(editedIndex, 1)
      this.$store.commit('app/SET_WA_TEMP_NUMBERS', this.groups)
      this.$store.commit('app/DELETE_NUMBERS', item)
      // const newCollection = Object.assign({}, this.collection)
      // newCollection.groups = this.groups
      // this.closeDelete()
    },
    saveItem(item) {
      this.$store.commit('app/ADD_NUMBERS', item)
      this.selected.push(item)
    },
    saveAll() {
      for (let i = 0; i < this.groups.length - 1; i++) {
        this.$store.commit('app/ADD_NUMBERS', this.groups[i])
      }
      this.closeDialog()
    },
  },
}
</script>

<style></style>
