import { DispatchEventMixin, CustomButtonMixin } from '@mcwv/base';
import { RippleMixin } from '@mcwv/ripple';

export default {
  name: 'mdc-fab',
  mixins: [DispatchEventMixin, CustomButtonMixin, RippleMixin],
  props: {
    icon: String,
    mini: Boolean,
    exited: Boolean,
    label: String,
  },
  data() {
    return {
      classes: {
        'mdc-fab': 1,
        'mdc-fab--mini': this.mini,
        'mdc-fab--extended': this.label || this.$slots.default,
        'mdc-fab--exited': this.exited,
      },
    };
  },
  watch: {
    icon() {
      this.$set(this.classes, 'material-icons', this.icon);
    },
    mini() {
      this.$set(this.classes, 'mdc-fab--mini', this.mini);
    },
    exited() {
      this.$set(this.classes, 'mdc-fab--exited', this.exited);
    },
  },
  render(createElement) {
    const nodes = [];

    if (this.$slots.icon) {
      const v0 = this.$slots.icon[0];
      if (v0) {
        const { staticClass = '' } = v0.data;
        const haveClasses =
          staticClass && staticClass.indexOf('mdc-fab__icon') > -1;
        if (!haveClasses) {
          v0.data.staticClass = `mdc-fab__icon ${staticClass}`;
        }
      }
      nodes.push(this.$slots.icon);
    } else {
      nodes.push(
        createElement(
          'span',
          { class: ['mdc-fab__icon', 'material-icons'] },
          this.icon,
        ),
      );
    }

    if (this.label || this.$slots.default) {
      nodes.push(
        createElement(
          'span',
          { class: { 'mdc-fab__label': 1 } },
          this.label || this.$slots.default,
        ),
      );
    }

    return createElement(
      'custom-button',
      {
        class: this.classes,
        styles: this.styles,
        attrs: { href: this.href, link: this.link },
        on: this.listeners,
      },
      nodes,
    );
  },
};
