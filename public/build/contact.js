"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["contact"],{

/***/ "./assets/components/Layout/Footer.jsx"
/*!*********************************************!*\
  !*** ./assets/components/Layout/Footer.jsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.map.js */ "./node_modules/core-js/modules/es.array.map.js");
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.date.to-string.js */ "./node_modules/core-js/modules/es.date.to-string.js");
/* harmony import */ var core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_translations_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/translations.js */ "./assets/utils/translations.js");
/* harmony import */ var _img_header_logo_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../img/header-logo.png */ "./assets/img/header-logo.png");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");







var Footer = function Footer() {
  var appData = window.APP_DATA || {};
  var routes = appData.routes,
    _appData$locale = appData.locale,
    locale = _appData$locale === void 0 ? 'en' : _appData$locale;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("footer", {
    id: "footer",
    className: "footer position-relative overflow-hidden",
    style: {
      background: '#0a0f1d',
      color: 'rgba(255,255,255,0.7)',
      padding: '100px 0 40px'
    },
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "footer-glow",
      style: {
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        background: 'rgba(133, 96, 205, 0.05)',
        borderRadius: '50%',
        filter: 'blur(100px)'
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "footer-glow",
      style: {
        position: 'absolute',
        bottom: '-50px',
        left: '-50px',
        width: '300px',
        height: '300px',
        background: 'rgba(146, 191, 231, 0.05)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "container position-relative",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "row gy-5",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "col-lg-4 col-md-6",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
            href: (routes === null || routes === void 0 ? void 0 : routes.home) || '/',
            className: "logo d-flex align-items-center mb-4 text-decoration-none",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
              src: _img_header_logo_png__WEBPACK_IMPORTED_MODULE_5__,
              alt: "Logo",
              className: "img-fluid",
              style: {
                maxHeight: '60px'
              }
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
            className: "pe-lg-5 mb-4",
            style: {
              lineHeight: '1.8',
              color: 'rgba(255,255,255,0.7)'
            },
            children: locale === 'hy' ? 'Համաշխարհային մակարդակի առողջապահություն՝ հասանելի բոլորին: Մենք համատեղում ենք բժշկական գիտությունը առաջադեմ տեխնոլոգիաների հետ:' : 'World-class healthcare accessible to everyone. We combine medical science with cutting-edge technology to provide the best patient experience.'
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "social-links d-flex gap-3",
            children: ['facebook', 'twitter', 'instagram', 'linkedin'].map(function (social) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
                href: "#",
                className: "social-icon d-flex align-items-center justify-content-center rounded-circle transition-all",
                style: {
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  textDecoration: 'none'
                },
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("i", {
                  className: "bi bi-".concat(social)
                })
              }, social);
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "col-lg-2 col-md-6",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h5", {
            className: "text-white fw-bold mb-4",
            children: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_4__.t)('footer.quickLinks', locale)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("ul", {
            className: "list-unstyled d-flex flex-column gap-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("li", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
                href: "/".concat(locale || 'hy'),
                className: "footer-link text-decoration-none transition-all",
                children: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_4__.t)('nav.home', locale)
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("li", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
                href: "/".concat(locale || 'hy', "/how-it-works"),
                className: "footer-link text-decoration-none transition-all",
                children: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_4__.t)('nav.howItWorks', locale)
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("li", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
                href: "/".concat(locale || 'hy', "/departments"),
                className: "footer-link text-decoration-none transition-all",
                children: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_4__.t)('nav.departments', locale)
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("li", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
                href: "/".concat(locale || 'hy', "/hospitals"),
                className: "footer-link text-decoration-none transition-all",
                children: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_4__.t)('nav.locations', locale)
              })
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "col-lg-3 col-md-6",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h5", {
            className: "text-white fw-bold mb-4",
            children: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_4__.t)('footer.ourServices', locale)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("ul", {
            className: "list-unstyled d-flex flex-column gap-3",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("li", {
              className: "d-flex align-items-center gap-2",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("i", {
                className: "bi bi-patch-check text-primary small"
              }), " ", (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_4__.t)('footer.diagnostics', locale)]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("li", {
              className: "d-flex align-items-center gap-2",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("i", {
                className: "bi bi-patch-check text-primary small"
              }), " ", (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_4__.t)('footer.treatment', locale)]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("li", {
              className: "d-flex align-items-center gap-2",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("i", {
                className: "bi bi-patch-check text-primary small"
              }), " ", (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_4__.t)('footer.preventive', locale)]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("li", {
              className: "d-flex align-items-center gap-2",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("i", {
                className: "bi bi-patch-check text-primary small"
              }), " ", (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_4__.t)('footer.laboratory', locale)]
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "col-lg-3 col-md-6",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h5", {
            className: "text-white fw-bold mb-4",
            children: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_4__.t)('footer.stayHealthy', locale)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
            className: "small mb-4",
            style: {
              color: 'rgba(255,255,255,0.7)'
            },
            children: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_4__.t)('footer.subscribeText', locale)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "newsletter-form mb-4",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "input-group p-1 rounded-pill transition-all",
              style: {
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(5px)'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("input", {
                type: "email",
                className: "form-control bg-transparent border-0 text-white px-4 py-2",
                placeholder: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_4__.t)('footer.emailPlaceholder', locale),
                style: {
                  boxShadow: 'none',
                  fontSize: '0.9rem'
                }
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
                className: "btn rounded-pill px-4 fw-bold text-white transition-all shadow-sm",
                style: {
                  background: 'linear-gradient(135deg, #6f0098 0%, #9260cd 100%)',
                  border: 'none',
                  fontSize: '0.9rem'
                },
                children: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_4__.t)('footer.joinBtn', locale)
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
            className: "contact-info d-flex flex-column gap-2 small",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "d-flex align-items-center gap-2",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("i", {
                className: "bi bi-telephone text-primary"
              }), " +1 234 567 8900"]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "d-flex align-items-center gap-2",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("i", {
                className: "bi bi-envelope text-primary"
              }), " info@eclinic.health"]
            })]
          })]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "container",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "mt-5 pt-4 border-top border-secondary border-opacity-10 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("p", {
          className: "mb-0 small",
          children: ["\xA9 ", new Date().getFullYear(), " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("strong", {
            className: "text-white",
            children: "eclinic."
          }), " All Rights Reserved."]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "d-flex gap-4 small",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
            href: "#",
            className: "footer-link text-decoration-none",
            children: "Privacy Policy"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
            href: "#",
            className: "footer-link text-decoration-none",
            children: "Terms of Service"
          })]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("style", {
      jsx: true,
      children: "\n                .footer-link {\n                    color: rgba(255,255,255,0.7);\n                }\n                .footer-link:hover {\n                    color: var(--brand-color);\n                    padding-left: 5px;\n                }\n                .social-icon:hover {\n                    background: var(--brand-color) !important;\n                    transform: translateY(-3px);\n                    box-shadow: 0 5px 15px rgba(133, 96, 205, 0.3);\n                }\n                .bg-gradient-purple {\n                    background: linear-gradient(135deg, var(--brand-color), #b196de);\n                }\n                .transition-all {\n                    transition: all 0.3s ease;\n                }\n                .tracking-tight {\n                    letter-spacing: -0.02em;\n                }\n                .input-group:focus-within {\n                    border-color: var(--brand-color) !important;\n                    box-shadow: 0 0 15px rgba(111, 0, 152, 0.2);\n                    background: rgba(255,255,255,0.06) !important;\n                }\n                .newsletter-form button:hover {\n                    transform: scale(1.05);\n                    box-shadow: 0 5px 15px rgba(111, 0, 152, 0.4);\n                }\n            "
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Footer);

/***/ },

/***/ "./assets/components/Layout/Header.jsx"
/*!*********************************************!*\
  !*** ./assets/components/Layout/Header.jsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.error.cause.js */ "./node_modules/core-js/modules/es.error.cause.js");
/* harmony import */ var core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_error_to_string_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.error.to-string.js */ "./node_modules/core-js/modules/es.error.to-string.js");
/* harmony import */ var core_js_modules_es_error_to_string_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_error_to_string_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.array.find.js */ "./node_modules/core-js/modules/es.array.find.js");
/* harmony import */ var core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_array_from_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.array.from.js */ "./node_modules/core-js/modules/es.array.from.js");
/* harmony import */ var core_js_modules_es_array_from_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_from_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ "./node_modules/core-js/modules/es.array.includes.js");
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_array_is_array_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.array.is-array.js */ "./node_modules/core-js/modules/es.array.is-array.js");
/* harmony import */ var core_js_modules_es_array_is_array_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_is_array_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_array_join_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.array.join.js */ "./node_modules/core-js/modules/es.array.join.js");
/* harmony import */ var core_js_modules_es_array_join_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_join_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.array.map.js */ "./node_modules/core-js/modules/es.array.map.js");
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.array.push.js */ "./node_modules/core-js/modules/es.array.push.js");
/* harmony import */ var core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.array.slice.js */ "./node_modules/core-js/modules/es.array.slice.js");
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var core_js_modules_es_array_splice_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es.array.splice.js */ "./node_modules/core-js/modules/es.array.splice.js");
/* harmony import */ var core_js_modules_es_array_splice_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_splice_js__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! core-js/modules/es.date.to-string.js */ "./node_modules/core-js/modules/es.date.to-string.js");
/* harmony import */ var core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var core_js_modules_es_regexp_test_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! core-js/modules/es.regexp.test.js */ "./node_modules/core-js/modules/es.regexp.test.js");
/* harmony import */ var core_js_modules_es_regexp_test_js__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_test_js__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! core-js/modules/es.regexp.to-string.js */ "./node_modules/core-js/modules/es.regexp.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_21___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_21__);
/* harmony import */ var core_js_modules_es_string_search_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! core-js/modules/es.string.search.js */ "./node_modules/core-js/modules/es.string.search.js");
/* harmony import */ var core_js_modules_es_string_search_js__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_search_js__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_23___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_23__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_24___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_24__);
/* harmony import */ var _img_header_logo_png__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../../img/header-logo.png */ "./assets/img/header-logo.png");
/* harmony import */ var _utils_translations_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../../utils/translations.js */ "./assets/utils/translations.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
























function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }




var Header = function Header() {
  var appData = window.APP_DATA || {};
  var user = appData.user,
    routes = appData.routes,
    _appData$locale = appData.locale,
    locale = _appData$locale === void 0 ? 'en' : _appData$locale;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_24__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    isScrolled = _useState2[0],
    setIsScrolled = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_24__.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isMenuOpen = _useState4[0],
    setIsMenuOpen = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_24__.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    isLangOpen = _useState6[0],
    setIsLangOpen = _useState6[1];
  var languages = [{
    code: 'en',
    name: 'English',
    flag: 'gb'
  }, {
    code: 'hy',
    name: 'Հայերեն',
    flag: 'am'
  }, {
    code: 'ru',
    name: 'Русский',
    flag: 'ru'
  }];
  var currentLang = languages.find(function (l) {
    return l.code === locale;
  }) || languages[0];
  var handleLanguageChange = function handleLanguageChange(newLocale) {
    var currentPath = window.location.pathname;
    var pathSegments = currentPath.split('/');

    // Check if path starts with a locale
    if (['en', 'hy', 'ru'].includes(pathSegments[1])) {
      pathSegments[1] = newLocale;
    } else {
      pathSegments.splice(1, 0, newLocale);
    }
    window.location.href = pathSegments.join('/') + window.location.search + window.location.hash;
  };
  (0,react__WEBPACK_IMPORTED_MODULE_24__.useEffect)(function () {
    var handleScroll = function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return function () {
      return window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  var navLinks = [{
    name: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_26__.t)('nav.home', locale),
    href: "/".concat(locale)
  }, {
    name: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_26__.t)('nav.howItWorks', locale),
    href: "/".concat(locale, "/how-it-works")
  }, {
    name: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_26__.t)('nav.departments', locale),
    href: "/".concat(locale, "/departments")
  }, {
    name: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_26__.t)('nav.locations', locale),
    href: "/".concat(locale, "/hospitals")
  }, {
    name: (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_26__.t)('nav.contact', locale),
    href: "/".concat(locale, "/contact")
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsxs)("header", {
    id: "header",
    className: "header fixed-top transition-all ".concat(isScrolled ? 'bg-white shadow-sm py-2' : 'py-3'),
    style: {
      transition: 'all 0.3s ease',
      backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none'
    },
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsxs)("div", {
      className: "container-fluid px-4 d-flex align-items-center justify-content-between",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("a", {
        href: routes.home,
        className: "logo d-flex align-items-center me-auto me-xl-0 text-decoration-none",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("img", {
          src: _img_header_logo_png__WEBPACK_IMPORTED_MODULE_25__,
          alt: "Logo",
          className: "img-fluid",
          style: {
            maxHeight: '55px'
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("nav", {
        id: "navmenu",
        className: "navmenu d-none d-xl-block mx-auto",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("ul", {
          className: "d-flex align-items-center mb-0 list-unstyled gap-4",
          children: navLinks.map(function (link) {
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("li", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("a", {
                href: link.href,
                className: "nav-link position-relative py-2",
                style: {
                  color: 'var(--nav-color)',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                },
                children: link.name
              })
            }, link.name);
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsxs)("div", {
        className: "d-flex align-items-center gap-3",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsxs)("div", {
          className: "position-relative d-none d-md-block",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsxs)("div", {
            className: "d-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-white border cursor-pointer hover-bg-gray transition-all shadow-sm",
            onClick: function onClick() {
              return setIsLangOpen(!isLangOpen);
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("span", {
              className: "fi fi-".concat(currentLang.flag, " rounded-circle")
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("span", {
              className: "fw-semibold small",
              children: currentLang.name
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("i", {
              className: "bi bi-chevron-".concat(isLangOpen ? 'up' : 'down', " small opacity-50")
            })]
          }), isLangOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("div", {
            className: "position-absolute mt-2 end-0 bg-white shadow-lg rounded-4 p-2 animate-fade-in",
            style: {
              zIndex: 1000,
              minWidth: '160px',
              border: '1px solid #edf2f7'
            },
            children: languages.map(function (lang) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsxs)("div", {
                className: "d-flex align-items-center gap-3 px-3 py-2 rounded-3 cursor-pointer transition-all ".concat(lang.code === locale ? 'bg-primary-subtle text-primary fw-bold' : 'hover-bg-light text-dark'),
                onClick: function onClick() {
                  return handleLanguageChange(lang.code);
                },
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("span", {
                  className: "fi fi-".concat(lang.flag, " rounded-circle")
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("span", {
                  className: "small",
                  children: lang.name
                }), lang.code === locale && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("i", {
                  className: "bi bi-check2 ms-auto"
                })]
              }, lang.code);
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsxs)("a", {
          href: user ? user.dashboard_url : routes.login,
          className: "btn rounded-pill px-4 py-2 d-none d-md-flex align-items-center gap-2 transition-all shadow-sm border-0 text-white",
          style: {
            background: 'linear-gradient(135deg, #1977cc 0%, #3b82f6 100%)',
            boxShadow: '0 4px 15px rgba(25, 119, 204, 0.2)',
            fontWeight: '600',
            letterSpacing: '0.01em'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("span", {
            className: "small",
            children: user ? (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_26__.t)('nav.myProfile', locale) : (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_26__.t)('nav.login', locale)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("div", {
            className: "d-flex align-items-center justify-content-center rounded-circle",
            style: {
              width: '32px',
              height: '32px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            },
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("i", {
              className: "bi ".concat(user ? 'bi-grid-fill' : 'bi-arrow-right-short', " text-white"),
              style: {
                fontSize: '1.1rem'
              }
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("button", {
          className: "btn btn-link p-0 border-0 d-xl-none ms-2",
          onClick: function onClick() {
            return setIsMenuOpen(true);
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("i", {
            className: "bi bi-list fs-1 text-dark"
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("style", {
      jsx: true,
      children: "\n                .nav-link {\n                    transition: color 0.3s ease;\n                }\n                .nav-link::before {\n                    display: none !important;\n                }\n                .nav-link::after {\n                    content: '';\n                    position: absolute;\n                    width: 0;\n                    height: 2px;\n                    bottom: 0;\n                    left: 0;\n                    background: #1977cc;\n                    transition: width 0.3s ease;\n                }\n                .nav-link:hover::after {\n                    width: 100%;\n                }\n                .btn:hover {\n                    transform: translateY(-2px);\n                    box-shadow: 0 8px 25px rgba(25, 119, 204, 0.3) !important;\n                    filter: brightness(1.1);\n                }\n                .hover-bg-gray:hover {\n                    background-color: #f8f9fa !important;\n                }\n                @keyframes fade-in {\n                    from { opacity: 0; transform: translateY(10px); }\n                    to { opacity: 1; transform: translateY(0); }\n                }\n                .animate-fade-in {\n                    animation: fade-in 0.3s ease-out forwards;\n                }\n            "
    }), isMenuOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsxs)("div", {
      className: "mobile-nav-overlay position-fixed top-0 start-0 w-100 h-100 bg-white d-xl-none",
      style: {
        zIndex: 2000,
        paddingTop: '80px',
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '120px',
        overflowY: 'auto'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsxs)("ul", {
        className: "list-unstyled",
        children: [navLinks.map(function (link) {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("li", {
            className: "mb-4",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("a", {
              href: link.href,
              className: "fs-3 fw-bold text-dark text-decoration-none",
              onClick: function onClick() {
                return setIsMenuOpen(false);
              },
              children: link.name
            })
          }, link.name);
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("li", {
          className: "mt-5",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("a", {
            href: user ? user.dashboard_url : routes.login,
            className: "btn btn-primary btn-lg w-100 rounded-pill mb-4",
            children: user ? (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_26__.t)('nav.goToPortal', locale) : (0,_utils_translations_js__WEBPACK_IMPORTED_MODULE_26__.t)('nav.login', locale)
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_27__.jsx)("button", {
        onClick: function onClick() {
          return setIsMenuOpen(false);
        },
        className: "position-absolute top-0 end-0 m-4 btn-close fs-3"
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Header);

/***/ },

/***/ "./assets/components/Layout/MainLayout.jsx"
/*!*************************************************!*\
  !*** ./assets/components/Layout/MainLayout.jsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! aos */ "./node_modules/aos/dist/aos.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(aos__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var aos_dist_aos_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! aos/dist/aos.css */ "./node_modules/aos/dist/aos.css");
/* harmony import */ var _Header__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Header */ "./assets/components/Layout/Header.jsx");
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Footer */ "./assets/components/Layout/Footer.jsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");






var MainLayout = function MainLayout(_ref) {
  var children = _ref.children;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    aos__WEBPACK_IMPORTED_MODULE_1___default().init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "main-layout",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("main", {
      children: children
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Footer__WEBPACK_IMPORTED_MODULE_4__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("a", {
      href: "#",
      id: "scroll-top",
      className: "scroll-top d-flex align-items-center justify-content-center",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("i", {
        className: "bi bi-arrow-up-short"
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MainLayout);

/***/ },

/***/ "./assets/components/pages/ContactPage.jsx"
/*!*************************************************!*\
  !*** ./assets/components/pages/ContactPage.jsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_translations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/translations */ "./assets/utils/translations.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");



var ContactPage = function ContactPage() {
  var appData = window.APP_DATA || {};
  var _appData$locale = appData.locale,
    locale = _appData$locale === void 0 ? 'en' : _appData$locale;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    className: "contact-page pt-3 mt-4",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "container py-3",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "section-title text-center mb-4",
        "data-aos": "fade-up",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-2 fw-bold text-uppercase",
          children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('nav.contact', locale)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
          className: "display-5 fw-bold mb-3",
          children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('nav.contact', locale)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          className: "text-muted lead mx-auto mb-0",
          style: {
            maxWidth: '700px'
          },
          children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('contact.subtitle', locale)
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "row g-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "col-lg-4",
          "data-aos": "fade-right",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "card h-100 border-0 shadow-sm p-4 rounded-4",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
              className: "info-item d-flex mb-4",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
                className: "icon-box bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3",
                style: {
                  width: '50px',
                  height: '50px'
                },
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("i", {
                  className: "bi bi-geo-alt fs-4"
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h5", {
                  className: "fw-bold mb-1",
                  children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('contact.location', locale)
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
                  className: "text-muted mb-0",
                  children: " Yerevan, Armenia"
                })]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
              className: "info-item d-flex mb-4",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
                className: "icon-box bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3",
                style: {
                  width: '50px',
                  height: '50px'
                },
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("i", {
                  className: "bi bi-envelope fs-4"
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h5", {
                  className: "fw-bold mb-1",
                  children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('contact.email', locale)
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
                  className: "text-muted mb-0",
                  children: "info@eclinic.am"
                })]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
              className: "info-item d-flex",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
                className: "icon-box bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3",
                style: {
                  width: '50px',
                  height: '50px'
                },
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("i", {
                  className: "bi bi-phone fs-4"
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h5", {
                  className: "fw-bold mb-1",
                  children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('contact.call', locale)
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
                  className: "text-muted mb-0",
                  children: "+374 10 000000"
                })]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
              className: "mt-4 pt-4 border-top",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h6", {
                className: "fw-bold mb-3 text-uppercase small text-muted",
                children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('contact.workingHours', locale)
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                className: "d-flex justify-content-between mb-2",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
                  className: "text-dark",
                  children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('contact.monFri', locale)
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
                  className: "text-muted",
                  children: "9:00 AM - 6:00 PM"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                className: "d-flex justify-content-between",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
                  className: "text-dark",
                  children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('contact.satSun', locale)
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
                  className: "text-muted",
                  children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('contact.closed', locale)
                })]
              })]
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "col-lg-8",
          "data-aos": "fade-left",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "card border-0 shadow-sm p-4 h-100 rounded-4",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("form", {
              className: "php-email-form",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                className: "row gy-4",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                  className: "col-md-6",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
                    htmlFor: "name-field",
                    className: "pb-2 fw-semibold",
                    children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('contact.yourName', locale)
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
                    type: "text",
                    name: "name",
                    id: "name-field",
                    className: "form-control rounded-3 py-2",
                    required: true
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                  className: "col-md-6",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
                    htmlFor: "email-field",
                    className: "pb-2 fw-semibold",
                    children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('contact.yourEmail', locale)
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
                    type: "email",
                    className: "form-control rounded-3 py-2",
                    name: "email",
                    id: "email-field",
                    required: true
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                  className: "col-md-12",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
                    htmlFor: "subject-field",
                    className: "pb-2 fw-semibold",
                    children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('contact.subject', locale)
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
                    type: "text",
                    className: "form-control rounded-3 py-2",
                    name: "subject",
                    id: "subject-field",
                    required: true
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                  className: "col-md-12",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
                    htmlFor: "message-field",
                    className: "pb-2 fw-semibold",
                    children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('contact.message', locale)
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("textarea", {
                    className: "form-control rounded-3",
                    name: "message",
                    rows: "5",
                    id: "message-field",
                    required: true
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
                  className: "col-md-12 text-center",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
                    type: "submit",
                    className: "btn btn-primary px-5 py-2 rounded-pill fw-bold",
                    children: (0,_utils_translations__WEBPACK_IMPORTED_MODULE_1__.t)('contact.send', locale)
                  })
                })]
              })
            })
          })
        })]
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ContactPage);

/***/ },

/***/ "./assets/contact.js"
/*!***************************!*\
  !*** ./assets/contact.js ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _components_pages_ContactPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/pages/ContactPage */ "./assets/components/pages/ContactPage.jsx");
/* harmony import */ var _components_Layout_MainLayout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/Layout/MainLayout */ "./assets/components/Layout/MainLayout.jsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");





var rootElement = document.getElementById('contact-root');
if (rootElement) {
  var root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(rootElement);
  root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_Layout_MainLayout__WEBPACK_IMPORTED_MODULE_3__["default"], {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_pages_ContactPage__WEBPACK_IMPORTED_MODULE_2__["default"], {})
  }));
}

/***/ },

/***/ "./assets/img/header-logo.png"
/*!************************************!*\
  !*** ./assets/img/header-logo.png ***!
  \************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/header-logo.f7fe8b83.png";

/***/ },

/***/ "./node_modules/core-js/internals/same-value.js"
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/same-value.js ***!
  \******************************************************/
(module) {


// `SameValue` abstract operation
// https://tc39.es/ecma262/#sec-samevalue
// eslint-disable-next-line es/no-object-is -- safe
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare -- NaN check
  return x === y ? x !== 0 || 1 / x === 1 / y : x !== x && y !== y;
};


/***/ },

/***/ "./node_modules/core-js/modules/es.array.find.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.find.js ***!
  \*******************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $find = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").find);
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js/internals/add-to-unscopables.js");

var FIND = 'find';
var SKIPS_HOLES = true;

// Shouldn't skip holes
// eslint-disable-next-line es/no-array-prototype-find -- testing
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.es/ecma262/#sec-array.prototype.find
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);


/***/ },

/***/ "./node_modules/core-js/modules/es.array.join.js"
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.join.js ***!
  \*******************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var arrayMethodIsStrict = __webpack_require__(/*! ../internals/array-method-is-strict */ "./node_modules/core-js/internals/array-method-is-strict.js");

var nativeJoin = uncurryThis([].join);

var ES3_STRINGS = IndexedObject !== Object;
var FORCED = ES3_STRINGS || !arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.es/ecma262/#sec-array.prototype.join
$({ target: 'Array', proto: true, forced: FORCED }, {
  join: function join(separator) {
    return nativeJoin(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});


/***/ },

/***/ "./node_modules/core-js/modules/es.string.search.js"
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.string.search.js ***!
  \**********************************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var fixRegExpWellKnownSymbolLogic = __webpack_require__(/*! ../internals/fix-regexp-well-known-symbol-logic */ "./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");
var sameValue = __webpack_require__(/*! ../internals/same-value */ "./node_modules/core-js/internals/same-value.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var regExpExec = __webpack_require__(/*! ../internals/regexp-exec-abstract */ "./node_modules/core-js/internals/regexp-exec-abstract.js");

// @@search logic
fixRegExpWellKnownSymbolLogic('search', function (SEARCH, nativeSearch, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.es/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = requireObjectCoercible(this);
      var searcher = isObject(regexp) ? getMethod(regexp, SEARCH) : undefined;
      return searcher ? call(searcher, regexp, O) : new RegExp(regexp)[SEARCH](toString(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
    function (string) {
      var rx = anObject(this);
      var S = toString(string);
      var res = maybeCallNative(nativeSearch, rx, S);

      if (res.done) return res.value;

      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});


/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors-node_modules_core-js_internals_array-method-is-strict_js-node_modules_core-js_interna-368251","vendors-node_modules_aos_dist_aos_js-node_modules_aos_dist_aos_css-node_modules_react-dom_cli-5fe8b7","assets_utils_translations_js"], () => (__webpack_exec__("./assets/contact.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2Fzc2V0cy9jb21wb25lbnRzL0xheW91dC9Gb290ZXIuanN4Iiwid2VicGFjazovLy8uL2Fzc2V0cy9jb21wb25lbnRzL0xheW91dC9IZWFkZXIuanN4Iiwid2VicGFjazovLy8uL2Fzc2V0cy9jb21wb25lbnRzL0xheW91dC9NYWluTGF5b3V0LmpzeCIsIndlYnBhY2s6Ly8vLi9hc3NldHMvY29tcG9uZW50cy9wYWdlcy9Db250YWN0UGFnZS5qc3giLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2NvbnRhY3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NhbWUtdmFsdWUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5maW5kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuam9pbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnN0cmluZy5zZWFyY2guanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgdCB9IGZyb20gJy4uLy4uL3V0aWxzL3RyYW5zbGF0aW9ucy5qcyc7XHJcbmltcG9ydCBsb2dvIGZyb20gJy4uLy4uL2ltZy9oZWFkZXItbG9nby5wbmcnO1xyXG5cclxuY29uc3QgRm9vdGVyID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYXBwRGF0YSA9IHdpbmRvdy5BUFBfREFUQSB8fCB7fTtcclxuICAgIGNvbnN0IHsgcm91dGVzLCBsb2NhbGUgPSAnZW4nIH0gPSBhcHBEYXRhO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGZvb3RlciBpZD1cImZvb3RlclwiIGNsYXNzTmFtZT1cImZvb3RlciBwb3NpdGlvbi1yZWxhdGl2ZSBvdmVyZmxvdy1oaWRkZW5cIiBzdHlsZT17eyBiYWNrZ3JvdW5kOiAnIzBhMGYxZCcsIGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwLjcpJywgcGFkZGluZzogJzEwMHB4IDAgNDBweCcgfX0+XHJcbiAgICAgICAgICAgIHsvKiBCYWNrZ3JvdW5kIERlY29yYXRpdmUgRWxlbWVudHMgKi99XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9vdGVyLWdsb3dcIiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnLTEwMHB4JywgcmlnaHQ6ICctMTAwcHgnLCB3aWR0aDogJzQwMHB4JywgaGVpZ2h0OiAnNDAwcHgnLCBiYWNrZ3JvdW5kOiAncmdiYSgxMzMsIDk2LCAyMDUsIDAuMDUpJywgYm9yZGVyUmFkaXVzOiAnNTAlJywgZmlsdGVyOiAnYmx1cigxMDBweCknIH19PjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvb3Rlci1nbG93XCIgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIGJvdHRvbTogJy01MHB4JywgbGVmdDogJy01MHB4Jywgd2lkdGg6ICczMDBweCcsIGhlaWdodDogJzMwMHB4JywgYmFja2dyb3VuZDogJ3JnYmEoMTQ2LCAxOTEsIDIzMSwgMC4wNSknLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBmaWx0ZXI6ICdibHVyKDgwcHgpJyB9fT48L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyIHBvc2l0aW9uLXJlbGF0aXZlXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBneS01XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgey8qIEJyYW5kIFNlY3Rpb24gKi99XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctNCBjb2wtbWQtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXtyb3V0ZXM/LmhvbWUgfHwgJy8nfSBjbGFzc05hbWU9XCJsb2dvIGQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgbWItNCB0ZXh0LWRlY29yYXRpb24tbm9uZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e2xvZ299IGFsdD1cIkxvZ29cIiBjbGFzc05hbWU9XCJpbWctZmx1aWRcIiBzdHlsZT17eyBtYXhIZWlnaHQ6ICc2MHB4JyB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInBlLWxnLTUgbWItNFwiIHN0eWxlPXt7IGxpbmVIZWlnaHQ6ICcxLjgnLCBjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMC43KScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bG9jYWxlID09PSAnaHknIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ9WA1aHVtNWh1bfVrdWh1oDVsNWh1bXVq9W2INW01aHVr9Wh1oDVpNWh1a/VqyDVodW81bjVstW71aHVutWh1bDVuNaC1anVtdW41oLVttWdINWw1aHVvdWh1bbVpdWs1asg1aLVuNWs1bjWgNWr1bY6INWE1aXVttaEINWw1aHVtNWh1b/VpdWy1bjWgtW0INWl1bbWhCDVotWq1bfVr9Wh1a/VodW2INWj1avVv9W41oLVqdW11bjWgtW21agg1aHVvNWh1bvVodWk1aXVtCDVv9Wl1a3VttW41azVuNWj1avVodW21aXWgNWrINWw1aXVvzonIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ1dvcmxkLWNsYXNzIGhlYWx0aGNhcmUgYWNjZXNzaWJsZSB0byBldmVyeW9uZS4gV2UgY29tYmluZSBtZWRpY2FsIHNjaWVuY2Ugd2l0aCBjdXR0aW5nLWVkZ2UgdGVjaG5vbG9neSB0byBwcm92aWRlIHRoZSBiZXN0IHBhdGllbnQgZXhwZXJpZW5jZS4nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic29jaWFsLWxpbmtzIGQtZmxleCBnYXAtM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1snZmFjZWJvb2snLCAndHdpdHRlcicsICdpbnN0YWdyYW0nLCAnbGlua2VkaW4nXS5tYXAoc29jaWFsID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBrZXk9e3NvY2lhbH0gaHJlZj1cIiNcIiBjbGFzc05hbWU9XCJzb2NpYWwtaWNvbiBkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXIgcm91bmRlZC1jaXJjbGUgdHJhbnNpdGlvbi1hbGxcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzQwcHgnLCBoZWlnaHQ6ICc0MHB4JywgYmFja2dyb3VuZDogJ3JnYmEoMjU1LDI1NSwyNTUsMC4wNSknLCBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjEpJywgY29sb3I6ICd3aGl0ZScsIHRleHREZWNvcmF0aW9uOiAnbm9uZScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT17YGJpIGJpLSR7c29jaWFsfWB9PjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHsvKiBRdWljayBMaW5rcyAqL31cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy0yIGNvbC1tZC02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlIGZ3LWJvbGQgbWItNFwiPnt0KCdmb290ZXIucXVpY2tMaW5rcycsIGxvY2FsZSl9PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImxpc3QtdW5zdHlsZWQgZC1mbGV4IGZsZXgtY29sdW1uIGdhcC0zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj17YC8ke2xvY2FsZSB8fCAnaHknfWB9IGNsYXNzTmFtZT1cImZvb3Rlci1saW5rIHRleHQtZGVjb3JhdGlvbi1ub25lIHRyYW5zaXRpb24tYWxsXCI+e3QoJ25hdi5ob21lJywgbG9jYWxlKX08L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPXtgLyR7bG9jYWxlIHx8ICdoeSd9L2hvdy1pdC13b3Jrc2B9IGNsYXNzTmFtZT1cImZvb3Rlci1saW5rIHRleHQtZGVjb3JhdGlvbi1ub25lIHRyYW5zaXRpb24tYWxsXCI+e3QoJ25hdi5ob3dJdFdvcmtzJywgbG9jYWxlKX08L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPXtgLyR7bG9jYWxlIHx8ICdoeSd9L2RlcGFydG1lbnRzYH0gY2xhc3NOYW1lPVwiZm9vdGVyLWxpbmsgdGV4dC1kZWNvcmF0aW9uLW5vbmUgdHJhbnNpdGlvbi1hbGxcIj57dCgnbmF2LmRlcGFydG1lbnRzJywgbG9jYWxlKX08L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPXtgLyR7bG9jYWxlIHx8ICdoeSd9L2hvc3BpdGFsc2B9IGNsYXNzTmFtZT1cImZvb3Rlci1saW5rIHRleHQtZGVjb3JhdGlvbi1ub25lIHRyYW5zaXRpb24tYWxsXCI+e3QoJ25hdi5sb2NhdGlvbnMnLCBsb2NhbGUpfTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICB7LyogU2VydmljZXMgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctMyBjb2wtbWQtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwidGV4dC13aGl0ZSBmdy1ib2xkIG1iLTRcIj57dCgnZm9vdGVyLm91clNlcnZpY2VzJywgbG9jYWxlKX08L2g1PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibGlzdC11bnN0eWxlZCBkLWZsZXggZmxleC1jb2x1bW4gZ2FwLTNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGdhcC0yXCI+PGkgY2xhc3NOYW1lPVwiYmkgYmktcGF0Y2gtY2hlY2sgdGV4dC1wcmltYXJ5IHNtYWxsXCI+PC9pPiB7dCgnZm9vdGVyLmRpYWdub3N0aWNzJywgbG9jYWxlKX08L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgZ2FwLTJcIj48aSBjbGFzc05hbWU9XCJiaSBiaS1wYXRjaC1jaGVjayB0ZXh0LXByaW1hcnkgc21hbGxcIj48L2k+IHt0KCdmb290ZXIudHJlYXRtZW50JywgbG9jYWxlKX08L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgZ2FwLTJcIj48aSBjbGFzc05hbWU9XCJiaSBiaS1wYXRjaC1jaGVjayB0ZXh0LXByaW1hcnkgc21hbGxcIj48L2k+IHt0KCdmb290ZXIucHJldmVudGl2ZScsIGxvY2FsZSl9PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGdhcC0yXCI+PGkgY2xhc3NOYW1lPVwiYmkgYmktcGF0Y2gtY2hlY2sgdGV4dC1wcmltYXJ5IHNtYWxsXCI+PC9pPiB7dCgnZm9vdGVyLmxhYm9yYXRvcnknLCBsb2NhbGUpfTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHsvKiBDb250YWN0ICYgTmV3c2xldHRlciAqL31cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy0zIGNvbC1tZC02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlIGZ3LWJvbGQgbWItNFwiPnt0KCdmb290ZXIuc3RheUhlYWx0aHknLCBsb2NhbGUpfTwvaDU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInNtYWxsIG1iLTRcIiBzdHlsZT17eyBjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMC43KScgfX0+e3QoJ2Zvb3Rlci5zdWJzY3JpYmVUZXh0JywgbG9jYWxlKX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmV3c2xldHRlci1mb3JtIG1iLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgcC0xIHJvdW5kZWQtcGlsbCB0cmFuc2l0aW9uLWFsbFwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjEpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tkcm9wRmlsdGVyOiAnYmx1cig1cHgpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImVtYWlsXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBiZy10cmFuc3BhcmVudCBib3JkZXItMCB0ZXh0LXdoaXRlIHB4LTQgcHktMlwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dCgnZm9vdGVyLmVtYWlsUGxhY2Vob2xkZXInLCBsb2NhbGUpfSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYm94U2hhZG93OiAnbm9uZScsIGZvbnRTaXplOiAnMC45cmVtJyB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIHJvdW5kZWQtcGlsbCBweC00IGZ3LWJvbGQgdGV4dC13aGl0ZSB0cmFuc2l0aW9uLWFsbCBzaGFkb3ctc21cIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICdsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNmYwMDk4IDAlLCAjOTI2MGNkIDEwMCUpJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjlyZW0nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3QoJ2Zvb3Rlci5qb2luQnRuJywgbG9jYWxlKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWN0LWluZm8gZC1mbGV4IGZsZXgtY29sdW1uIGdhcC0yIHNtYWxsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgZ2FwLTJcIj48aSBjbGFzc05hbWU9XCJiaSBiaS10ZWxlcGhvbmUgdGV4dC1wcmltYXJ5XCI+PC9pPiArMSAyMzQgNTY3IDg5MDA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBnYXAtMlwiPjxpIGNsYXNzTmFtZT1cImJpIGJpLWVudmVsb3BlIHRleHQtcHJpbWFyeVwiPjwvaT4gaW5mb0BlY2xpbmljLmhlYWx0aDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICB7LyogQm90dG9tIEJhciAqL31cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNSBwdC00IGJvcmRlci10b3AgYm9yZGVyLXNlY29uZGFyeSBib3JkZXItb3BhY2l0eS0xMCBkLWZsZXggZmxleC1jb2x1bW4gZmxleC1tZC1yb3cganVzdGlmeS1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtY2VudGVyIGdhcC0zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibWItMCBzbWFsbFwiPsKpIHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9IDxzdHJvbmcgY2xhc3NOYW1lPVwidGV4dC13aGl0ZVwiPmVjbGluaWMuPC9zdHJvbmc+IEFsbCBSaWdodHMgUmVzZXJ2ZWQuPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZC1mbGV4IGdhcC00IHNtYWxsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3NOYW1lPVwiZm9vdGVyLWxpbmsgdGV4dC1kZWNvcmF0aW9uLW5vbmVcIj5Qcml2YWN5IFBvbGljeTwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzc05hbWU9XCJmb290ZXItbGluayB0ZXh0LWRlY29yYXRpb24tbm9uZVwiPlRlcm1zIG9mIFNlcnZpY2U8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8c3R5bGUganN4PntgXHJcbiAgICAgICAgICAgICAgICAuZm9vdGVyLWxpbmsge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiByZ2JhKDI1NSwyNTUsMjU1LDAuNyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAuZm9vdGVyLWxpbms6aG92ZXIge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1icmFuZC1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiA1cHg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAuc29jaWFsLWljb246aG92ZXIge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWJyYW5kLWNvbG9yKSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtM3B4KTtcclxuICAgICAgICAgICAgICAgICAgICBib3gtc2hhZG93OiAwIDVweCAxNXB4IHJnYmEoMTMzLCA5NiwgMjA1LCAwLjMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLmJnLWdyYWRpZW50LXB1cnBsZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgdmFyKC0tYnJhbmQtY29sb3IpLCAjYjE5NmRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uLWFsbCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC50cmFja2luZy10aWdodCB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IC0wLjAyZW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAuaW5wdXQtZ3JvdXA6Zm9jdXMtd2l0aGluIHtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcigtLWJyYW5kLWNvbG9yKSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAxNXB4IHJnYmEoMTExLCAwLCAxNTIsIDAuMik7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsMjU1LDI1NSwwLjA2KSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLm5ld3NsZXR0ZXItZm9ybSBidXR0b246aG92ZXIge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCA1cHggMTVweCByZ2JhKDExMSwgMCwgMTUyLCAwLjQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBgfTwvc3R5bGU+XHJcbiAgICAgICAgPC9mb290ZXI+XHJcbiAgICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRm9vdGVyO1xyXG5cclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgbG9nbyBmcm9tICcuLi8uLi9pbWcvaGVhZGVyLWxvZ28ucG5nJztcbmltcG9ydCB7IHQgfSBmcm9tICcuLi8uLi91dGlscy90cmFuc2xhdGlvbnMuanMnO1xuXG5jb25zdCBIZWFkZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgYXBwRGF0YSA9IHdpbmRvdy5BUFBfREFUQSB8fCB7fTtcbiAgICBjb25zdCB7IHVzZXIsIHJvdXRlcywgbG9jYWxlID0gJ2VuJyB9ID0gYXBwRGF0YTtcbiAgICBjb25zdCBbaXNTY3JvbGxlZCwgc2V0SXNTY3JvbGxlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW2lzTWVudU9wZW4sIHNldElzTWVudU9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtpc0xhbmdPcGVuLCBzZXRJc0xhbmdPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICAgIGNvbnN0IGxhbmd1YWdlcyA9IFtcbiAgICAgICAgeyBjb2RlOiAnZW4nLCBuYW1lOiAnRW5nbGlzaCcsIGZsYWc6ICdnYicgfSxcbiAgICAgICAgeyBjb2RlOiAnaHknLCBuYW1lOiAn1YDVodW11aXWgNWl1bYnLCBmbGFnOiAnYW0nIH0sXG4gICAgICAgIHsgY29kZTogJ3J1JywgbmFtZTogJ9Cg0YPRgdGB0LrQuNC5JywgZmxhZzogJ3J1JyB9XG4gICAgXTtcblxuICAgIGNvbnN0IGN1cnJlbnRMYW5nID0gbGFuZ3VhZ2VzLmZpbmQobCA9PiBsLmNvZGUgPT09IGxvY2FsZSkgfHwgbGFuZ3VhZ2VzWzBdO1xuXG4gICAgY29uc3QgaGFuZGxlTGFuZ3VhZ2VDaGFuZ2UgPSAobmV3TG9jYWxlKSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRQYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgICAgICBjb25zdCBwYXRoU2VnbWVudHMgPSBjdXJyZW50UGF0aC5zcGxpdCgnLycpO1xuICAgICAgICBcbiAgICAgICAgLy8gQ2hlY2sgaWYgcGF0aCBzdGFydHMgd2l0aCBhIGxvY2FsZVxuICAgICAgICBpZiAoWydlbicsICdoeScsICdydSddLmluY2x1ZGVzKHBhdGhTZWdtZW50c1sxXSkpIHtcbiAgICAgICAgICAgIHBhdGhTZWdtZW50c1sxXSA9IG5ld0xvY2FsZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhdGhTZWdtZW50cy5zcGxpY2UoMSwgMCwgbmV3TG9jYWxlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoU2VnbWVudHMuam9pbignLycpICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCArIHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuICAgIH07XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBoYW5kbGVTY3JvbGwgPSAoKSA9PiB7XG4gICAgICAgICAgICBzZXRJc1Njcm9sbGVkKHdpbmRvdy5zY3JvbGxZID4gMjApO1xuICAgICAgICB9O1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgaGFuZGxlU2Nyb2xsKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBoYW5kbGVTY3JvbGwpO1xuICAgIH0sIFtdKTtcblxuICAgIGNvbnN0IG5hdkxpbmtzID0gW1xuICAgICAgICB7IG5hbWU6IHQoJ25hdi5ob21lJywgbG9jYWxlKSwgaHJlZjogYC8ke2xvY2FsZX1gIH0sXG4gICAgICAgIHsgbmFtZTogdCgnbmF2Lmhvd0l0V29ya3MnLCBsb2NhbGUpLCBocmVmOiBgLyR7bG9jYWxlfS9ob3ctaXQtd29ya3NgIH0sXG4gICAgICAgIHsgbmFtZTogdCgnbmF2LmRlcGFydG1lbnRzJywgbG9jYWxlKSwgaHJlZjogYC8ke2xvY2FsZX0vZGVwYXJ0bWVudHNgIH0sXG4gICAgICAgIHsgbmFtZTogdCgnbmF2LmxvY2F0aW9ucycsIGxvY2FsZSksIGhyZWY6IGAvJHtsb2NhbGV9L2hvc3BpdGFsc2AgfSxcbiAgICAgICAgeyBuYW1lOiB0KCduYXYuY29udGFjdCcsIGxvY2FsZSksIGhyZWY6IGAvJHtsb2NhbGV9L2NvbnRhY3RgIH1cbiAgICBdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGhlYWRlclxuICAgICAgICAgICAgaWQ9XCJoZWFkZXJcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgaGVhZGVyIGZpeGVkLXRvcCB0cmFuc2l0aW9uLWFsbCAke2lzU2Nyb2xsZWQgPyAnYmctd2hpdGUgc2hhZG93LXNtIHB5LTInIDogJ3B5LTMnfWB9XG4gICAgICAgICAgICBzdHlsZT17eyBcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuM3MgZWFzZScsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBpc1Njcm9sbGVkID8gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC45NSknIDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICBiYWNrZHJvcEZpbHRlcjogaXNTY3JvbGxlZCA/ICdibHVyKDEwcHgpJyA6ICdub25lJ1xuICAgICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXItZmx1aWQgcHgtNCBkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj17cm91dGVzLmhvbWV9IGNsYXNzTmFtZT1cImxvZ28gZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBtZS1hdXRvIG1lLXhsLTAgdGV4dC1kZWNvcmF0aW9uLW5vbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e2xvZ299IGFsdD1cIkxvZ29cIiBjbGFzc05hbWU9XCJpbWctZmx1aWRcIiBzdHlsZT17eyBtYXhIZWlnaHQ6ICc1NXB4JyB9fSAvPlxuICAgICAgICAgICAgICAgIDwvYT5cblxuICAgICAgICAgICAgICAgIDxuYXYgaWQ9XCJuYXZtZW51XCIgY2xhc3NOYW1lPVwibmF2bWVudSBkLW5vbmUgZC14bC1ibG9jayBteC1hdXRvXCI+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIG1iLTAgbGlzdC11bnN0eWxlZCBnYXAtNFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge25hdkxpbmtzLm1hcCgobGluaykgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e2xpbmsubmFtZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e2xpbmsuaHJlZn0gY2xhc3NOYW1lPVwibmF2LWxpbmsgcG9zaXRpb24tcmVsYXRpdmUgcHktMlwiIHN0eWxlPXt7IGNvbG9yOiAndmFyKC0tbmF2LWNvbG9yKScsIGZvbnRXZWlnaHQ6IDYwMCwgZm9udFNpemU6ICcwLjlyZW0nIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpbmsubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8L25hdj5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBvc2l0aW9uLXJlbGF0aXZlIGQtbm9uZSBkLW1kLWJsb2NrXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgZ2FwLTIgcHgtMyBweS0yIHJvdW5kZWQtcGlsbCBiZy13aGl0ZSBib3JkZXIgY3Vyc29yLXBvaW50ZXIgaG92ZXItYmctZ3JheSB0cmFuc2l0aW9uLWFsbCBzaGFkb3ctc21cIiBvbkNsaWNrPXsoKSA9PiBzZXRJc0xhbmdPcGVuKCFpc0xhbmdPcGVuKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgZmkgZmktJHtjdXJyZW50TGFuZy5mbGFnfSByb3VuZGVkLWNpcmNsZWB9Pjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmdy1zZW1pYm9sZCBzbWFsbFwiPntjdXJyZW50TGFuZy5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9e2BiaSBiaS1jaGV2cm9uLSR7aXNMYW5nT3BlbiA/ICd1cCcgOiAnZG93bid9IHNtYWxsIG9wYWNpdHktNTBgfT48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpc0xhbmdPcGVuICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBvc2l0aW9uLWFic29sdXRlIG10LTIgZW5kLTAgYmctd2hpdGUgc2hhZG93LWxnIHJvdW5kZWQtNCBwLTIgYW5pbWF0ZS1mYWRlLWluXCIgc3R5bGU9e3sgekluZGV4OiAxMDAwLCBtaW5XaWR0aDogJzE2MHB4JywgYm9yZGVyOiAnMXB4IHNvbGlkICNlZGYyZjcnIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bGFuZ3VhZ2VzLm1hcCgobGFuZykgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2xhbmcuY29kZX0gY2xhc3NOYW1lPXtgZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBnYXAtMyBweC0zIHB5LTIgcm91bmRlZC0zIGN1cnNvci1wb2ludGVyIHRyYW5zaXRpb24tYWxsICR7bGFuZy5jb2RlID09PSBsb2NhbGUgPyAnYmctcHJpbWFyeS1zdWJ0bGUgdGV4dC1wcmltYXJ5IGZ3LWJvbGQnIDogJ2hvdmVyLWJnLWxpZ2h0IHRleHQtZGFyayd9YH0gb25DbGljaz17KCkgPT4gaGFuZGxlTGFuZ3VhZ2VDaGFuZ2UobGFuZy5jb2RlKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgZmkgZmktJHtsYW5nLmZsYWd9IHJvdW5kZWQtY2lyY2xlYH0+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNtYWxsXCI+e2xhbmcubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2xhbmcuY29kZSA9PT0gbG9jYWxlICYmIDxpIGNsYXNzTmFtZT1cImJpIGJpLWNoZWNrMiBtcy1hdXRvXCI+PC9pPn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXt1c2VyID8gdXNlci5kYXNoYm9hcmRfdXJsIDogcm91dGVzLmxvZ2lufSBcbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIHJvdW5kZWQtcGlsbCBweC00IHB5LTIgZC1ub25lIGQtbWQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgZ2FwLTIgdHJhbnNpdGlvbi1hbGwgc2hhZG93LXNtIGJvcmRlci0wIHRleHQtd2hpdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ2xpbmVhci1ncmFkaWVudCgxMzVkZWcsICMxOTc3Y2MgMCUsICMzYjgyZjYgMTAwJSknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCA0cHggMTVweCByZ2JhKDI1LCAxMTksIDIwNCwgMC4yKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjAxZW0nXG4gICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic21hbGxcIj57dXNlciA/IHQoJ25hdi5teVByb2ZpbGUnLCBsb2NhbGUpIDogdCgnbmF2LmxvZ2luJywgbG9jYWxlKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlciByb3VuZGVkLWNpcmNsZVwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMzJweCcsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMzJweCcsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9e2BiaSAke3VzZXIgPyAnYmktZ3JpZC1maWxsJyA6ICdiaS1hcnJvdy1yaWdodC1zaG9ydCd9IHRleHQtd2hpdGVgfSBzdHlsZT17eyBmb250U2l6ZTogJzEuMXJlbScgfX0+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWxpbmsgcC0wIGJvcmRlci0wIGQteGwtbm9uZSBtcy0yXCIgb25DbGljaz17KCkgPT4gc2V0SXNNZW51T3Blbih0cnVlKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJiaSBiaS1saXN0IGZzLTEgdGV4dC1kYXJrXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8c3R5bGUganN4PntgXG4gICAgICAgICAgICAgICAgLm5hdi1saW5rIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyBlYXNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAubmF2LWxpbms6OmJlZm9yZSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLm5hdi1saW5rOjphZnRlciB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICcnO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAwO1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDJweDtcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAwO1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwO1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAjMTk3N2NjO1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCAwLjNzIGVhc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC5uYXYtbGluazpob3Zlcjo6YWZ0ZXIge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLmJ0bjpob3ZlciB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMnB4KTtcbiAgICAgICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCA4cHggMjVweCByZ2JhKDI1LCAxMTksIDIwNCwgMC4zKSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IGJyaWdodG5lc3MoMS4xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLmhvdmVyLWJnLWdyYXk6aG92ZXIge1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmOWZhICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEBrZXlmcmFtZXMgZmFkZS1pbiB7XG4gICAgICAgICAgICAgICAgICAgIGZyb20geyBvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTBweCk7IH1cbiAgICAgICAgICAgICAgICAgICAgdG8geyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7IH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLmFuaW1hdGUtZmFkZS1pbiB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZmFkZS1pbiAwLjNzIGVhc2Utb3V0IGZvcndhcmRzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGB9PC9zdHlsZT5cblxuICAgICAgICAgICAge2lzTWVudU9wZW4gJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9iaWxlLW5hdi1vdmVybGF5IHBvc2l0aW9uLWZpeGVkIHRvcC0wIHN0YXJ0LTAgdy0xMDAgaC0xMDAgYmctd2hpdGUgZC14bC1ub25lXCIgc3R5bGU9e3sgekluZGV4OiAyMDAwLCBwYWRkaW5nVG9wOiAnODBweCcsIHBhZGRpbmdMZWZ0OiAnMjBweCcsIHBhZGRpbmdSaWdodDogJzIwcHgnLCBwYWRkaW5nQm90dG9tOiAnMTIwcHgnLCBvdmVyZmxvd1k6ICdhdXRvJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImxpc3QtdW5zdHlsZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtuYXZMaW5rcy5tYXAoKGxpbmspID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkga2V5PXtsaW5rLm5hbWV9IGNsYXNzTmFtZT1cIm1iLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17bGluay5ocmVmfSBjbGFzc05hbWU9XCJmcy0zIGZ3LWJvbGQgdGV4dC1kYXJrIHRleHQtZGVjb3JhdGlvbi1ub25lXCIgb25DbGljaz17KCkgPT4gc2V0SXNNZW51T3BlbihmYWxzZSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2xpbmsubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJtdC01XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17dXNlciA/IHVzZXIuZGFzaGJvYXJkX3VybCA6IHJvdXRlcy5sb2dpbn0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1sZyB3LTEwMCByb3VuZGVkLXBpbGwgbWItNFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dXNlciA/IHQoJ25hdi5nb1RvUG9ydGFsJywgbG9jYWxlKSA6IHQoJ25hdi5sb2dpbicsIGxvY2FsZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRJc01lbnVPcGVuKGZhbHNlKX0gY2xhc3NOYW1lPVwicG9zaXRpb24tYWJzb2x1dGUgdG9wLTAgZW5kLTAgbS00IGJ0bi1jbG9zZSBmcy0zXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICA8L2hlYWRlcj5cbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgSGVhZGVyO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IEFPUyBmcm9tICdhb3MnO1xyXG5pbXBvcnQgJ2Fvcy9kaXN0L2Fvcy5jc3MnO1xyXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vSGVhZGVyJztcclxuaW1wb3J0IEZvb3RlciBmcm9tICcuL0Zvb3Rlcic7XHJcblxyXG5jb25zdCBNYWluTGF5b3V0ID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBBT1MuaW5pdCh7XHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxyXG4gICAgICAgICAgICBvbmNlOiB0cnVlLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IDEwMFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSwgW10pO1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1haW4tbGF5b3V0XCI+XHJcbiAgICAgICAgICAgIDxtYWluPlxyXG4gICAgICAgICAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICAgICAgICA8L21haW4+XHJcbiAgICAgICAgICAgIDxGb290ZXIgLz5cclxuICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBpZD1cInNjcm9sbC10b3BcIiBjbGFzc05hbWU9XCJzY3JvbGwtdG9wIGQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiYmkgYmktYXJyb3ctdXAtc2hvcnRcIj48L2k+XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNYWluTGF5b3V0O1xyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdCB9IGZyb20gJy4uLy4uL3V0aWxzL3RyYW5zbGF0aW9ucyc7XG5cbmNvbnN0IENvbnRhY3RQYWdlID0gKCkgPT4ge1xuICAgIGNvbnN0IGFwcERhdGEgPSB3aW5kb3cuQVBQX0RBVEEgfHwge307XG4gICAgY29uc3QgeyBsb2NhbGUgPSAnZW4nIH0gPSBhcHBEYXRhO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWN0LXBhZ2UgcHQtMyBtdC00XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lciBweS0zXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLXRpdGxlIHRleHQtY2VudGVyIG1iLTRcIiBkYXRhLWFvcz1cImZhZGUtdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYmFkZ2UgYmctcHJpbWFyeS1zdWJ0bGUgdGV4dC1wcmltYXJ5IHB4LTMgcHktMiByb3VuZGVkLXBpbGwgbWItMiBmdy1ib2xkIHRleHQtdXBwZXJjYXNlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnbmF2LmNvbnRhY3QnLCBsb2NhbGUpfVxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJkaXNwbGF5LTUgZnctYm9sZCBtYi0zXCI+e3QoJ25hdi5jb250YWN0JywgbG9jYWxlKX08L2gyPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LW11dGVkIGxlYWQgbXgtYXV0byBtYi0wXCIgc3R5bGU9e3sgbWF4V2lkdGg6ICc3MDBweCcgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnY29udGFjdC5zdWJ0aXRsZScsIGxvY2FsZSl9XG4gICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGctNFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy00XCIgZGF0YS1hb3M9XCJmYWRlLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQgaC0xMDAgYm9yZGVyLTAgc2hhZG93LXNtIHAtNCByb3VuZGVkLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm8taXRlbSBkLWZsZXggbWItNFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImljb24tYm94IGJnLXByaW1hcnktc3VidGxlIHRleHQtcHJpbWFyeSByb3VuZGVkLWNpcmNsZSBkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXIgbWUtM1wiIHN0eWxlPXt7IHdpZHRoOiAnNTBweCcsIGhlaWdodDogJzUwcHgnIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiYmkgYmktZ2VvLWFsdCBmcy00XCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJmdy1ib2xkIG1iLTFcIj57dCgnY29udGFjdC5sb2NhdGlvbicsIGxvY2FsZSl9PC9oNT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtbXV0ZWQgbWItMFwiPiBZZXJldmFuLCBBcm1lbmlhPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5mby1pdGVtIGQtZmxleCBtYi00XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaWNvbi1ib3ggYmctcHJpbWFyeS1zdWJ0bGUgdGV4dC1wcmltYXJ5IHJvdW5kZWQtY2lyY2xlIGQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlciBtZS0zXCIgc3R5bGU9e3sgd2lkdGg6ICc1MHB4JywgaGVpZ2h0OiAnNTBweCcgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJiaSBiaS1lbnZlbG9wZSBmcy00XCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJmdy1ib2xkIG1iLTFcIj57dCgnY29udGFjdC5lbWFpbCcsIGxvY2FsZSl9PC9oNT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtbXV0ZWQgbWItMFwiPmluZm9AZWNsaW5pYy5hbTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm8taXRlbSBkLWZsZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpY29uLWJveCBiZy1wcmltYXJ5LXN1YnRsZSB0ZXh0LXByaW1hcnkgcm91bmRlZC1jaXJjbGUgZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIG1lLTNcIiBzdHlsZT17eyB3aWR0aDogJzUwcHgnLCBoZWlnaHQ6ICc1MHB4JyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImJpIGJpLXBob25lIGZzLTRcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cImZ3LWJvbGQgbWItMVwiPnt0KCdjb250YWN0LmNhbGwnLCBsb2NhbGUpfTwvaDU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LW11dGVkIG1iLTBcIj4rMzc0IDEwIDAwMDAwMDwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgcHQtNCBib3JkZXItdG9wXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNiBjbGFzc05hbWU9XCJmdy1ib2xkIG1iLTMgdGV4dC11cHBlcmNhc2Ugc21hbGwgdGV4dC1tdXRlZFwiPnt0KCdjb250YWN0LndvcmtpbmdIb3VycycsIGxvY2FsZSl9PC9oNj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkLWZsZXgganVzdGlmeS1jb250ZW50LWJldHdlZW4gbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYXJrXCI+e3QoJ2NvbnRhY3QubW9uRnJpJywgbG9jYWxlKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW11dGVkXCI+OTowMCBBTSAtIDY6MDAgUE08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1kYXJrXCI+e3QoJ2NvbnRhY3Quc2F0U3VuJywgbG9jYWxlKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW11dGVkXCI+e3QoJ2NvbnRhY3QuY2xvc2VkJywgbG9jYWxlKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLThcIiBkYXRhLWFvcz1cImZhZGUtbGVmdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIGJvcmRlci0wIHNoYWRvdy1zbSBwLTQgaC0xMDAgcm91bmRlZC00XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwicGhwLWVtYWlsLWZvcm1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZ3ktNFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtNlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZS1maWVsZFwiIGNsYXNzTmFtZT1cInBiLTIgZnctc2VtaWJvbGRcIj57dCgnY29udGFjdC55b3VyTmFtZScsIGxvY2FsZSl9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIGlkPVwibmFtZS1maWVsZFwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCByb3VuZGVkLTMgcHktMlwiIHJlcXVpcmVkIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtNlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZW1haWwtZmllbGRcIiBjbGFzc05hbWU9XCJwYi0yIGZ3LXNlbWlib2xkXCI+e3QoJ2NvbnRhY3QueW91ckVtYWlsJywgbG9jYWxlKX08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgcm91bmRlZC0zIHB5LTJcIiBuYW1lPVwiZW1haWxcIiBpZD1cImVtYWlsLWZpZWxkXCIgcmVxdWlyZWQgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwic3ViamVjdC1maWVsZFwiIGNsYXNzTmFtZT1cInBiLTIgZnctc2VtaWJvbGRcIj57dCgnY29udGFjdC5zdWJqZWN0JywgbG9jYWxlKX08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCByb3VuZGVkLTMgcHktMlwiIG5hbWU9XCJzdWJqZWN0XCIgaWQ9XCJzdWJqZWN0LWZpZWxkXCIgcmVxdWlyZWQgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0xMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibWVzc2FnZS1maWVsZFwiIGNsYXNzTmFtZT1cInBiLTIgZnctc2VtaWJvbGRcIj57dCgnY29udGFjdC5tZXNzYWdlJywgbG9jYWxlKX08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgcm91bmRlZC0zXCIgbmFtZT1cIm1lc3NhZ2VcIiByb3dzPVwiNVwiIGlkPVwibWVzc2FnZS1maWVsZFwiIHJlcXVpcmVkPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMTIgdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgcHgtNSBweS0yIHJvdW5kZWQtcGlsbCBmdy1ib2xkXCI+e3QoJ2NvbnRhY3Quc2VuZCcsIGxvY2FsZSl9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDb250YWN0UGFnZTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjcmVhdGVSb290IH0gZnJvbSAncmVhY3QtZG9tL2NsaWVudCc7XG5pbXBvcnQgQ29udGFjdFBhZ2UgZnJvbSAnLi9jb21wb25lbnRzL3BhZ2VzL0NvbnRhY3RQYWdlJztcbmltcG9ydCBNYWluTGF5b3V0IGZyb20gJy4vY29tcG9uZW50cy9MYXlvdXQvTWFpbkxheW91dCc7XG5cbmNvbnN0IHJvb3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3Qtcm9vdCcpO1xuaWYgKHJvb3RFbGVtZW50KSB7XG4gICAgY29uc3Qgcm9vdCA9IGNyZWF0ZVJvb3Qocm9vdEVsZW1lbnQpO1xuICAgIHJvb3QucmVuZGVyKFxuICAgICAgICA8TWFpbkxheW91dD5cbiAgICAgICAgICAgIDxDb250YWN0UGFnZSAvPlxuICAgICAgICA8L01haW5MYXlvdXQ+XG4gICAgKTtcbn1cbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGBTYW1lVmFsdWVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1zYW1ldmFsdWVcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtaXMgLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuaXMgfHwgZnVuY3Rpb24gaXMoeCwgeSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlIC0tIE5hTiBjaGVja1xuICByZXR1cm4geCA9PT0geSA/IHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5IDogeCAhPT0geCAmJiB5ICE9PSB5O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyICRmaW5kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWl0ZXJhdGlvbicpLmZpbmQ7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hZGQtdG8tdW5zY29wYWJsZXMnKTtcblxudmFyIEZJTkQgPSAnZmluZCc7XG52YXIgU0tJUFNfSE9MRVMgPSB0cnVlO1xuXG4vLyBTaG91bGRuJ3Qgc2tpcCBob2xlc1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLWFycmF5LXByb3RvdHlwZS1maW5kIC0tIHRlc3RpbmdcbmlmIChGSU5EIGluIFtdKSBBcnJheSgxKVtGSU5EXShmdW5jdGlvbiAoKSB7IFNLSVBTX0hPTEVTID0gZmFsc2U7IH0pO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmZpbmRgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZmluZFxuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogU0tJUFNfSE9MRVMgfSwge1xuICBmaW5kOiBmdW5jdGlvbiBmaW5kKGNhbGxiYWNrZm4gLyogLCB0aGF0ID0gdW5kZWZpbmVkICovKSB7XG4gICAgcmV0dXJuICRmaW5kKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLUBAdW5zY29wYWJsZXNcbmFkZFRvVW5zY29wYWJsZXMoRklORCk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcbnZhciBJbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0Jyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgYXJyYXlNZXRob2RJc1N0cmljdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1tZXRob2QtaXMtc3RyaWN0Jyk7XG5cbnZhciBuYXRpdmVKb2luID0gdW5jdXJyeVRoaXMoW10uam9pbik7XG5cbnZhciBFUzNfU1RSSU5HUyA9IEluZGV4ZWRPYmplY3QgIT09IE9iamVjdDtcbnZhciBGT1JDRUQgPSBFUzNfU1RSSU5HUyB8fCAhYXJyYXlNZXRob2RJc1N0cmljdCgnam9pbicsICcsJyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuam9pbmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5qb2luXG4kKHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBGT1JDRUQgfSwge1xuICBqb2luOiBmdW5jdGlvbiBqb2luKHNlcGFyYXRvcikge1xuICAgIHJldHVybiBuYXRpdmVKb2luKHRvSW5kZXhlZE9iamVjdCh0aGlzKSwgc2VwYXJhdG9yID09PSB1bmRlZmluZWQgPyAnLCcgOiBzZXBhcmF0b3IpO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjYWxsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWNhbGwnKTtcbnZhciBmaXhSZWdFeHBXZWxsS25vd25TeW1ib2xMb2dpYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9maXgtcmVnZXhwLXdlbGwta25vd24tc3ltYm9sLWxvZ2ljJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcbnZhciBzYW1lVmFsdWUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2FtZS12YWx1ZScpO1xudmFyIHRvU3RyaW5nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXN0cmluZycpO1xudmFyIGdldE1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtbWV0aG9kJyk7XG52YXIgcmVnRXhwRXhlYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtZXhlYy1hYnN0cmFjdCcpO1xuXG4vLyBAQHNlYXJjaCBsb2dpY1xuZml4UmVnRXhwV2VsbEtub3duU3ltYm9sTG9naWMoJ3NlYXJjaCcsIGZ1bmN0aW9uIChTRUFSQ0gsIG5hdGl2ZVNlYXJjaCwgbWF5YmVDYWxsTmF0aXZlKSB7XG4gIHJldHVybiBbXG4gICAgLy8gYFN0cmluZy5wcm90b3R5cGUuc2VhcmNoYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUuc2VhcmNoXG4gICAgZnVuY3Rpb24gc2VhcmNoKHJlZ2V4cCkge1xuICAgICAgdmFyIE8gPSByZXF1aXJlT2JqZWN0Q29lcmNpYmxlKHRoaXMpO1xuICAgICAgdmFyIHNlYXJjaGVyID0gaXNPYmplY3QocmVnZXhwKSA/IGdldE1ldGhvZChyZWdleHAsIFNFQVJDSCkgOiB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4gc2VhcmNoZXIgPyBjYWxsKHNlYXJjaGVyLCByZWdleHAsIE8pIDogbmV3IFJlZ0V4cChyZWdleHApW1NFQVJDSF0odG9TdHJpbmcoTykpO1xuICAgIH0sXG4gICAgLy8gYFJlZ0V4cC5wcm90b3R5cGVbQEBzZWFyY2hdYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXJlZ2V4cC5wcm90b3R5cGUtQEBzZWFyY2hcbiAgICBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICB2YXIgcnggPSBhbk9iamVjdCh0aGlzKTtcbiAgICAgIHZhciBTID0gdG9TdHJpbmcoc3RyaW5nKTtcbiAgICAgIHZhciByZXMgPSBtYXliZUNhbGxOYXRpdmUobmF0aXZlU2VhcmNoLCByeCwgUyk7XG5cbiAgICAgIGlmIChyZXMuZG9uZSkgcmV0dXJuIHJlcy52YWx1ZTtcblxuICAgICAgdmFyIHByZXZpb3VzTGFzdEluZGV4ID0gcngubGFzdEluZGV4O1xuICAgICAgaWYgKCFzYW1lVmFsdWUocHJldmlvdXNMYXN0SW5kZXgsIDApKSByeC5sYXN0SW5kZXggPSAwO1xuICAgICAgdmFyIHJlc3VsdCA9IHJlZ0V4cEV4ZWMocngsIFMpO1xuICAgICAgaWYgKCFzYW1lVmFsdWUocngubGFzdEluZGV4LCBwcmV2aW91c0xhc3RJbmRleCkpIHJ4Lmxhc3RJbmRleCA9IHByZXZpb3VzTGFzdEluZGV4O1xuICAgICAgcmV0dXJuIHJlc3VsdCA9PT0gbnVsbCA/IC0xIDogcmVzdWx0LmluZGV4O1xuICAgIH1cbiAgXTtcbn0pO1xuIl0sIm5hbWVzIjpbIlJlYWN0IiwidCIsImxvZ28iLCJqc3giLCJfanN4IiwianN4cyIsIl9qc3hzIiwiRm9vdGVyIiwiYXBwRGF0YSIsIndpbmRvdyIsIkFQUF9EQVRBIiwicm91dGVzIiwiX2FwcERhdGEkbG9jYWxlIiwibG9jYWxlIiwiaWQiLCJjbGFzc05hbWUiLCJzdHlsZSIsImJhY2tncm91bmQiLCJjb2xvciIsInBhZGRpbmciLCJjaGlsZHJlbiIsInBvc2l0aW9uIiwidG9wIiwicmlnaHQiLCJ3aWR0aCIsImhlaWdodCIsImJvcmRlclJhZGl1cyIsImZpbHRlciIsImJvdHRvbSIsImxlZnQiLCJocmVmIiwiaG9tZSIsInNyYyIsImFsdCIsIm1heEhlaWdodCIsImxpbmVIZWlnaHQiLCJtYXAiLCJzb2NpYWwiLCJib3JkZXIiLCJ0ZXh0RGVjb3JhdGlvbiIsImNvbmNhdCIsImJhY2tkcm9wRmlsdGVyIiwidHlwZSIsInBsYWNlaG9sZGVyIiwiYm94U2hhZG93IiwiZm9udFNpemUiLCJEYXRlIiwiZ2V0RnVsbFllYXIiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsIkhlYWRlciIsInVzZXIiLCJfdXNlU3RhdGUiLCJfdXNlU3RhdGUyIiwiX3NsaWNlZFRvQXJyYXkiLCJpc1Njcm9sbGVkIiwic2V0SXNTY3JvbGxlZCIsIl91c2VTdGF0ZTMiLCJfdXNlU3RhdGU0IiwiaXNNZW51T3BlbiIsInNldElzTWVudU9wZW4iLCJfdXNlU3RhdGU1IiwiX3VzZVN0YXRlNiIsImlzTGFuZ09wZW4iLCJzZXRJc0xhbmdPcGVuIiwibGFuZ3VhZ2VzIiwiY29kZSIsIm5hbWUiLCJmbGFnIiwiY3VycmVudExhbmciLCJmaW5kIiwibCIsImhhbmRsZUxhbmd1YWdlQ2hhbmdlIiwibmV3TG9jYWxlIiwiY3VycmVudFBhdGgiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwicGF0aFNlZ21lbnRzIiwic3BsaXQiLCJpbmNsdWRlcyIsInNwbGljZSIsImpvaW4iLCJzZWFyY2giLCJoYXNoIiwiaGFuZGxlU2Nyb2xsIiwic2Nyb2xsWSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibmF2TGlua3MiLCJ0cmFuc2l0aW9uIiwiYmFja2dyb3VuZENvbG9yIiwibGluayIsImZvbnRXZWlnaHQiLCJvbkNsaWNrIiwiekluZGV4IiwibWluV2lkdGgiLCJsYW5nIiwiZGFzaGJvYXJkX3VybCIsImxvZ2luIiwibGV0dGVyU3BhY2luZyIsInBhZGRpbmdUb3AiLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdSaWdodCIsInBhZGRpbmdCb3R0b20iLCJvdmVyZmxvd1kiLCJBT1MiLCJNYWluTGF5b3V0IiwiX3JlZiIsImluaXQiLCJkdXJhdGlvbiIsIm9uY2UiLCJvZmZzZXQiLCJDb250YWN0UGFnZSIsIm1heFdpZHRoIiwiaHRtbEZvciIsInJlcXVpcmVkIiwicm93cyIsImNyZWF0ZVJvb3QiLCJyb290RWxlbWVudCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyb290IiwicmVuZGVyIl0sInNvdXJjZVJvb3QiOiIifQ==