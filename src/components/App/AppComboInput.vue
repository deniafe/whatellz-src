<template>
  <v-combobox
    v-model="keywords"
    label="Select Options"
    :filter="filter"
    :hide-no-data="!search"
    :items="items"
    :search-input.sync="search"
    hide-selected
    multiple
    solo
    small-chips
    background-color="input"
  >
    <template v-slot:no-data>
      <v-list-item>
        <span class="subheading">Create</span>
        <v-chip :color="`${colors[nonce - 1]} lighten-3`" label small>
          {{ search }}
        </v-chip>
      </v-list-item>
    </template>
    <template v-slot:selection="{ attrs, item, parent, selected }">
      <v-chip
        v-if="item === Object(item)"
        v-bind="attrs"
        :color="`${item.color} lighten-3`"
        :input-value="selected"
        label
        dark
        small
      >
        <span class="pr-2">
          {{ item.text }}
        </span>
        <v-icon x-small @click="parent.selectItem(item)"> mdi-close </v-icon>
      </v-chip>
    </template>
    <template v-slot:item="{ index, item }">
      <!-- <v-textarea
        v-if="editing === item"
        v-model="editing.text"
        append-icon="mdi-emoticon-cool-outline"
        autofocus
        flat
        background-color="input"
        hide-details
        solo
        @keyup.enter="edit(index, item)"
      ></v-textarea> -->

      <v-textarea
        v-if="editing === item"
        v-model="editing.text"
        append-icon="mdi-emoticon-cool-outline"
        autofocus
        flat
        background-color="input"
        hide-details
        solo
      ></v-textarea>

      <v-chip v-else :color="`${item.color} lighten-3`" dark label small>
        {{ item.text }}
      </v-chip>
      <v-spacer></v-spacer>
      <v-list-item-action @click.stop>
        <v-btn icon @click.stop.prevent="edit(index, item)">
          <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>
  </v-combobox>
</template>

<script>
export default {
  name: 'AppCombobox',
  props: {
    items: {
      type: Array,
      required: true,
    },
    keyword: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    activator: null,
    attach: null,
    colors: [
      'purple lighten-1',
      'green',
      'purple',
      'indigo',
      'cyan',
      'teal',
      'orange',
      'yellow',
      'brown darken-4',
      'indigo accent-4',
      'cyan accent-2',
      'Banana Mania',
      'cream',
      'flirt',
      'burgundy',
    ],
    editing: null,
    editingIndex: -1,
    nonce: 1,
    menu: false,
    x: 0,
    search: null,
    y: 0,
  }),

  computed: {
    keywords: {
      get() {
        return this.keyword
      },
      set(val) {
        this.updateKeyword(val)
      },
    },
  },

  watch: {
    model(val, prev) {
      if (val.length === prev.length) return

      this.model = val.map((v) => {
        if (typeof v === 'string') {
          v = {
            text: v,
            color: this.colors[this.nonce - 1],
          }

          this.items.push(v)

          this.nonce++
        }

        return v
      })
    },
  },

  methods: {
    edit(index, item) {
      if (!this.editing) {
        this.editing = item
        this.editingIndex = index
      } else {
        this.editing = null
        this.editingIndex = -1
      }
    },
    filter(item, queryText, itemText) {
      if (item.header) return false

      const hasValue = (val) => (val != null ? val : '')

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return (
        text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) >
        -1
      )
    },
    updateKeyword(val) {
      this.$emit('update', val)
    },
  },
}
</script>

<style scoped>
.theme--dark.v-list {
  background-color: #1e3530;
  color: #ffffff;
}
</style>
