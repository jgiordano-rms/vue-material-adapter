import MDCFixedTopAppBarFoundation from '@material/top-app-bar/fixed/foundation';
import MDCShortTopAppBarFoundation from '@material/top-app-bar/short/foundation';
import MDCTopAppBarFoundation from '@material/top-app-bar/standard/foundation';
import { cssClasses } from './constants';
import { emitCustomEvent } from '@mcwv/base';

export default {
  name: 'mcw-top-app-bar',
  props: {
    short: Boolean,
    shortCollapsed: Boolean,
    prominent: Boolean,
    fixed: Boolean,
    dense: Boolean,
    tag: { type: String, default: 'header' },
    scrollTarget: HTMLElement,
  },
  data() {
    return {
      rootStyles: { top: '0' },
      rootClasses: {
        'mdc-top-app-bar': true,
        'mdc-top-app-bar--dense': this.dense,
        'mdc-top-app-bar--short': this.short,
        'mdc-top-app-bar--short-collapsed': this.shortCollapsed,
        'mdc-top-app-bar--prominent': this.prominent,
        'mdc-top-app-bar--fixed': this.fixed,
      },
      myScrollTarget: null,
    };
  },

  watch: {
    scrollTarget(nv, ov) {
      if (nv !== ov) {
        this.myScrollTarget.removeEventListener(
          'scroll',
          this.foundation_.handleTargetScroll,
        );
        this.myScrollTarget = nv;
        this.myScrollTarget.addEventListener(
          'scroll',
          this.foundation_.handleTargetScroll,
        );
      }
    },
  },
  methods: {
    handleNavigationClick_(event) {
      this.foundation_.handleNavigationClick(event);
    },
  },

  mounted() {
    const {
      strings: { NAVIGATION_EVENT, NAVIGATION_ICON_SELECTOR },
    } = MDCTopAppBarFoundation;

    const adapter = {
      addClass: className => this.$set(this.rootClasses, className, true),
      removeClass: className => this.$delete(this.rootClasses, className),
      hasClass: className => Boolean(this.rootClasses[className]),
      setStyle: (property, value) =>
        this.$set(this.rootStyles, property, value),
      getTopAppBarHeight: () => this.$el.clientHeight,
      notifyNavigationIconClicked: () => {
        this.$emit('nav', {});
        emitCustomEvent(
          this.$el,
          NAVIGATION_EVENT,
          {},
          /** shouldBubble */ true,
        );
      },

      //  registerScrollHandler: handler => {
      //         if (this.myScrollTarget) {
      //           this.myScrollTarget.addEventListener('scroll', handler);
      //         } else {
      //           window.addEventListener('scroll', handler);
      //         }
      //       },
      //       deregisterScrollHandler: handler => {
      //         if (this.myScrollTarget) {
      //           this.myScrollTarget.removeEventListener('scroll', handler);
      //         } else {
      //           window.removeEventListener('scroll', handler);
      //         }
      //       },
      getViewportScrollY: () => window.pageYOffset,
      getTotalActionItems: () =>
        this.$refs.root.querySelectorAll(`.${cssClasses.ACTION_ITEM}`).length,
    };

    const { short, shortCollapsed, fixed } = this;
    if (short || shortCollapsed) {
      this.foundation_ = new MDCShortTopAppBarFoundation(adapter);
    } else if (fixed) {
      this.foundation_ = new MDCFixedTopAppBarFoundation(adapter);
    } else {
      this.foundation_ = new MDCTopAppBarFoundation(adapter);
    }

    this.navIcon_ = this.$el.querySelector(NAVIGATION_ICON_SELECTOR);

    if (this.navIcon_) {
      this.navIcon_.addEventListener('click', this.handleNavigationClick_);
    }

    this.myScrollTarget = this.scrollTarget || window;
    this.foundation_.init();
  },
  beforeDestroy() {
    if (this.navIcon_) {
      this.navIcon_.removeEventListener('click', this.handleNavigationClick_);
    }

    this.myScrollTarget &&
      this.myScrollTarget.removeEventListener(
        'scroll',
        this.foundation_.handleTargetScroll,
      );
    this.foundation_.destroy();
  },
  render(createElement) {
    const { $scopedSlots: scopedSlots } = this;
    return createElement(
      this.tag,
      {
        class: this.rootClasses,
        style: this.rootStyles,
        ref: 'root',
        on: this.$listeners,
      },
      scopedSlots.default && scopedSlots.default(),
    );
  },
};
