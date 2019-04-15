import { RippleBase } from '@mcwv/ripple';

const template = `  <li
    :class="[classes, itemClasses]"
    :style="styles"
    :tabindex="isInteractive ? '0' : undefined"
    class="mdc-list-item"
    v-on="isInteractive ? $listeners : {}"
  >
    <!-- <span v-if="hasStartDetail" class="mdc-list-item__graphic"> -->
    <slot name="start-detail"/>
    <!-- </span> -->

    <span class="mdc-list-item__text" v-if="hasSecondary">
      <span class="mdc-list-item__primary-text">
        <slot/>
      </span>
      <span class="mdc-list-item__secondary-text" v-if="hasSecondary">
        <slot name="secondary"/>
      </span>
    </span>

    <span class="mdc-list-item__text" v-else>
      <slot/>
    </span>

    <!-- <span v-if="hasEndDetail" class="mdc-list-item__meta"> -->
    <slot name="end-detail"/>
    <!-- </span> -->
  </li>`;

export default {
  name: 'mdc-list-item',
  template,
  inject: ['mdcList'],
  props: {
    selected: Boolean,
    activated: Boolean,
  },
  data() {
    return {
      classes: {},
      styles: {},
    };
  },
  computed: {
    itemClasses() {
      return {
        'mdc-list-item--selected': this.selected,
        'mdc-list-item--activated': this.activated,
      };
    },
    isInteractive() {
      return this.mdcList && this.mdcList.interactive;
    },
    hasSecondary() {
      return this.$slots['secondary'] && (this.mdcList && this.mdcList.twoLine);
    },
    hasEndDetail() {
      return !!this.$slots['end-detail'];
    },
    hasStartDetail() {
      return !!this.$slots['start-detail'];
    },
  },
  watch: {
    isInteractive(value) {
      if (value) {
        this.addRipple();
      } else {
        this.removeRipple();
      }
    },
  },
  mounted() {
    this.isInteractive && this.addRipple();
  },
  beforeDestroy() {
    this.removeRipple();
  },
  methods: {
    addRipple() {
      if (!this.ripple) {
        const ripple = new RippleBase(this);
        ripple.init();
        this.ripple = ripple;
      }
    },
    removeRipple() {
      if (this.ripple) {
        const ripple = this.ripple;
        this.ripple = null;
        ripple.destroy();
      }
    },
  },
};