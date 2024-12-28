import _ from "lodash";

export interface Country {
  name: string;
  image: string;
}

const imageAssets = import.meta.glob<{
  default: string;
}>("/public/images/flags/*.{jpg,jpeg,png,svg}", { eager: true });

const fakers = {
  fakeCountries() {
    const countries: Array<Country> = [
      {
        name: "French Polynesia",
        image: imageAssets["/public/images/flags/pf.svg"].default,
      },
      {
        name: "Saint Martin",
        image: imageAssets["/public/images/flags/mf.svg"].default,
      },
      {
        name: "Venezuela",
        image: imageAssets["/public/images/flags/ve.svg"].default,
      },
      {
        name: "Réunion",
        image: imageAssets["/public/images/flags/re.svg"].default,
      },
      {
        name: "El Salvador",
        image: imageAssets["/public/images/flags/sv.svg"].default,
      },
      {
        name: "Dominica",
        image: imageAssets["/public/images/flags/dm.svg"].default,
      },
      {
        name: "Gibraltar",
        image: imageAssets["/public/images/flags/gi.svg"].default,
      },
      {
        name: "Kenya",
        image: imageAssets["/public/images/flags/ke.svg"].default,
      },
      {
        name: "Brazil",
        image: imageAssets["/public/images/flags/br.svg"].default,
      },
      {
        name: "Maldives",
        image: imageAssets["/public/images/flags/mv.svg"].default,
      },
      {
        name: "United States",
        image: imageAssets["/public/images/flags/us.svg"].default,
      },
      {
        name: "Cook Islands",
        image: imageAssets["/public/images/flags/ck.svg"].default,
      },
      {
        name: "Niue",
        image: imageAssets["/public/images/flags/nu.svg"].default,
      },
      {
        name: "Seychelles",
        image: imageAssets["/public/images/flags/sc.svg"].default,
      },
      {
        name: "Central African Republic",
        image: imageAssets["/public/images/flags/cf.svg"].default,
      },
      {
        name: "Tokelau",
        image: imageAssets["/public/images/flags/tk.svg"].default,
      },
      {
        name: "Vanuatu",
        image: imageAssets["/public/images/flags/vu.svg"].default,
      },
      {
        name: "Gambia",
        image: imageAssets["/public/images/flags/gm.svg"].default,
      },
      {
        name: "Guyana",
        image: imageAssets["/public/images/flags/gy.svg"].default,
      },
      {
        name: "Falkland Islands",
        image: imageAssets["/public/images/flags/fk.svg"].default,
      },
      {
        name: "Belgium",
        image: imageAssets["/public/images/flags/be.svg"].default,
      },
      {
        name: "Western Sahara",
        image: imageAssets["/public/images/flags/eh.svg"].default,
      },
      {
        name: "Turkey",
        image: imageAssets["/public/images/flags/tr.svg"].default,
      },
      {
        name: "Saint Vincent and the Grenadines",
        image: imageAssets["/public/images/flags/vc.svg"].default,
      },
      {
        name: "Pakistan",
        image: imageAssets["/public/images/flags/pk.svg"].default,
      },
      {
        name: "Åland Islands",
        image: imageAssets["/public/images/flags/ax.svg"].default,
      },
      {
        name: "Iran",
        image: imageAssets["/public/images/flags/ir.svg"].default,
      },
      {
        name: "Indonesia",
        image: imageAssets["/public/images/flags/id.svg"].default,
      },
      {
        name: "New Zealand",
        image: imageAssets["/public/images/flags/nz.svg"].default,
      },
      {
        name: "Afghanistan",
        image:
          imageAssets["/public/images/flags/Flag_of_the_Taliban.svg"]
            .default,
      },
      {
        name: "Guam",
        image: imageAssets["/public/images/flags/gu.svg"].default,
      },
      {
        name: "Albania",
        image: imageAssets["/public/images/flags/al.svg"].default,
      },
      {
        name: "DR Congo",
        image: imageAssets["/public/images/flags/cd.svg"].default,
      },
      {
        name: "Ivory Coast",
        image: imageAssets["/public/images/flags/ci.svg"].default,
      },
      {
        name: "Sudan",
        image: imageAssets["/public/images/flags/sd.svg"].default,
      },
      {
        name: "Timor-Leste",
        image: imageAssets["/public/images/flags/tl.svg"].default,
      },
      {
        name: "Luxembourg",
        image: imageAssets["/public/images/flags/lu.svg"].default,
      },
      {
        name: "Saudi Arabia",
        image: imageAssets["/public/images/flags/sa.svg"].default,
      },
      {
        name: "Cambodia",
        image: imageAssets["/public/images/flags/kh.svg"].default,
      },
      {
        name: "Nepal",
        image: imageAssets["/public/images/flags/np.svg"].default,
      },
      {
        name: "French Guiana",
        image: imageAssets["/public/images/flags/gf.svg"].default,
      },
      {
        name: "Malaysia",
        image: imageAssets["/public/images/flags/my.svg"].default,
      },
      {
        name: "Rwanda",
        image: imageAssets["/public/images/flags/rw.svg"].default,
      },
      {
        name: "Thailand",
        image: imageAssets["/public/images/flags/th.svg"].default,
      },
      {
        name: "Antarctica",
        image: imageAssets["/public/images/flags/aq.svg"].default,
      },
      {
        name: "Jordan",
        image: imageAssets["/public/images/flags/jo.svg"].default,
      },
      {
        name: "Switzerland",
        image: imageAssets["/public/images/flags/ch.svg"].default,
      },
      {
        name: "Comoros",
        image: imageAssets["/public/images/flags/km.svg"].default,
      },
      {
        name: "Kosovo",
        image: imageAssets["/public/images/flags/xk.svg"].default,
      },
      {
        name: "Isle of Man",
        image: imageAssets["/public/images/flags/im.svg"].default,
      },
      {
        name: "Montenegro",
        image: imageAssets["/public/images/flags/me.svg"].default,
      },
      {
        name: "Hong Kong",
        image: imageAssets["/public/images/flags/hk.svg"].default,
      },
      {
        name: "Jersey",
        image: imageAssets["/public/images/flags/je.svg"].default,
      },
      {
        name: "Tajikistan",
        image: imageAssets["/public/images/flags/tj.svg"].default,
      },
      {
        name: "Bulgaria",
        image: imageAssets["/public/images/flags/bg.svg"].default,
      },
      {
        name: "Egypt",
        image: imageAssets["/public/images/flags/eg.svg"].default,
      },
      {
        name: "Malawi",
        image: imageAssets["/public/images/flags/mw.svg"].default,
      },
      {
        name: "Cape Verde",
        image: imageAssets["/public/images/flags/cv.svg"].default,
      },
      {
        name: "Benin",
        image: imageAssets["/public/images/flags/bj.svg"].default,
      },
      {
        name: "Morocco",
        image: imageAssets["/public/images/flags/ma.svg"].default,
      },
      {
        name: "Ireland",
        image: imageAssets["/public/images/flags/ie.svg"].default,
      },
      {
        name: "Moldova",
        image: imageAssets["/public/images/flags/md.svg"].default,
      },
      {
        name: "Denmark",
        image: imageAssets["/public/images/flags/dk.svg"].default,
      },
      {
        name: "Turkmenistan",
        image: imageAssets["/public/images/flags/tm.svg"].default,
      },
      {
        name: "Micronesia",
        image: imageAssets["/public/images/flags/fm.svg"].default,
      },
      {
        name: "Monaco",
        image: imageAssets["/public/images/flags/mc.svg"].default,
      },
      {
        name: "Barbados",
        image: imageAssets["/public/images/flags/bb.svg"].default,
      },
      {
        name: "Algeria",
        image: imageAssets["/public/images/flags/dz.svg"].default,
      },
      {
        name: "French Southern and Antarctic Lands",
        image: imageAssets["/public/images/flags/tf.svg"].default,
      },
      {
        name: "Eritrea",
        image: imageAssets["/public/images/flags/er.svg"].default,
      },
      {
        name: "Lesotho",
        image: imageAssets["/public/images/flags/ls.svg"].default,
      },
      {
        name: "Tanzania",
        image: imageAssets["/public/images/flags/tz.svg"].default,
      },
      {
        name: "Mali",
        image: imageAssets["/public/images/flags/ml.svg"].default,
      },
      {
        name: "Niger",
        image: imageAssets["/public/images/flags/ne.svg"].default,
      },
      {
        name: "Andorra",
        image: imageAssets["/public/images/flags/ad.svg"].default,
      },
      {
        name: "United Kingdom",
        image: imageAssets["/public/images/flags/gb.svg"].default,
      },
      {
        name: "Germany",
        image: imageAssets["/public/images/flags/de.svg"].default,
      },
      {
        name: "United States Virgin Islands",
        image: imageAssets["/public/images/flags/vi.svg"].default,
      },
      {
        name: "Somalia",
        image: imageAssets["/public/images/flags/so.svg"].default,
      },
      {
        name: "Sint Maarten",
        image: imageAssets["/public/images/flags/sx.svg"].default,
      },
      {
        name: "Cameroon",
        image: imageAssets["/public/images/flags/cm.svg"].default,
      },
      {
        name: "Dominican Republic",
        image: imageAssets["/public/images/flags/do.svg"].default,
      },
      {
        name: "Guinea",
        image: imageAssets["/public/images/flags/gn.svg"].default,
      },
      {
        name: "Namibia",
        image: imageAssets["/public/images/flags/na.svg"].default,
      },
      {
        name: "Montserrat",
        image: imageAssets["/public/images/flags/ms.svg"].default,
      },
      {
        name: "South Georgia",
        image: imageAssets["/public/images/flags/gs.svg"].default,
      },
      {
        name: "Senegal",
        image: imageAssets["/public/images/flags/sn.svg"].default,
      },
      {
        name: "Bouvet Island",
        image: imageAssets["/public/images/flags/bv.svg"].default,
      },
      {
        name: "Solomon Islands",
        image: imageAssets["/public/images/flags/sb.svg"].default,
      },
      {
        name: "France",
        image: imageAssets["/public/images/flags/fr.svg"].default,
      },
      {
        name: "Saint Helena, Ascension and Tristan da Cunha",
        image: imageAssets["/public/images/flags/sh.svg"].default,
      },
      {
        name: "Macau",
        image: imageAssets["/public/images/flags/mo.svg"].default,
      },
      {
        name: "Argentina",
        image: imageAssets["/public/images/flags/ar.svg"].default,
      },
      {
        name: "Bosnia and Herzegovina",
        image: imageAssets["/public/images/flags/ba.svg"].default,
      },
      {
        name: "Anguilla",
        image: imageAssets["/public/images/flags/ai.svg"].default,
      },
      {
        name: "Guernsey",
        image: imageAssets["/public/images/flags/gg.svg"].default,
      },
      {
        name: "Djibouti",
        image: imageAssets["/public/images/flags/dj.svg"].default,
      },
      {
        name: "Saint Kitts and Nevis",
        image: imageAssets["/public/images/flags/kn.svg"].default,
      },
      {
        name: "Syria",
        image: imageAssets["/public/images/flags/sy.svg"].default,
      },
      {
        name: "Puerto Rico",
        image: imageAssets["/public/images/flags/pr.svg"].default,
      },
      {
        name: "Peru",
        image: imageAssets["/public/images/flags/pe.svg"].default,
      },
      {
        name: "San Marino",
        image: imageAssets["/public/images/flags/sm.svg"].default,
      },
      {
        name: "Australia",
        image: imageAssets["/public/images/flags/au.svg"].default,
      },
      {
        name: "New Caledonia",
        image: imageAssets["/public/images/flags/nc.svg"].default,
      },
      {
        name: "Jamaica",
        image: imageAssets["/public/images/flags/jm.svg"].default,
      },
      {
        name: "Kazakhstan",
        image: imageAssets["/public/images/flags/kz.svg"].default,
      },
      {
        name: "Sierra Leone",
        image: imageAssets["/public/images/flags/sl.svg"].default,
      },
      {
        name: "Palau",
        image: imageAssets["/public/images/flags/pw.svg"].default,
      },
      {
        name: "South Korea",
        image: imageAssets["/public/images/flags/kr.svg"].default,
      },
      {
        name: "Saint Pierre and Miquelon",
        image: imageAssets["/public/images/flags/pm.svg"].default,
      },
      {
        name: "Belize",
        image: imageAssets["/public/images/flags/bz.svg"].default,
      },
      {
        name: "Papua New Guinea",
        image: imageAssets["/public/images/flags/pg.svg"].default,
      },
      {
        name: "Iceland",
        image: imageAssets["/public/images/flags/is.svg"].default,
      },
      {
        name: "American Samoa",
        image: imageAssets["/public/images/flags/as.svg"].default,
      },
      {
        name: "Burkina Faso",
        image: imageAssets["/public/images/flags/bf.svg"].default,
      },
      {
        name: "Portugal",
        image: imageAssets["/public/images/flags/pt.svg"].default,
      },
      {
        name: "Taiwan",
        image: imageAssets["/public/images/flags/tw.svg"].default,
      },
      {
        name: "Japan",
        image: imageAssets["/public/images/flags/jp.svg"].default,
      },
      {
        name: "China",
        image: imageAssets["/public/images/flags/cn.svg"].default,
      },
      {
        name: "Lebanon",
        image: imageAssets["/public/images/flags/lb.svg"].default,
      },
      {
        name: "Sri Lanka",
        image: imageAssets["/public/images/flags/lk.svg"].default,
      },
      {
        name: "Guatemala",
        image: imageAssets["/public/images/flags/gt.svg"].default,
      },
      {
        name: "Serbia",
        image: imageAssets["/public/images/flags/rs.svg"].default,
      },
      {
        name: "Madagascar",
        image: imageAssets["/public/images/flags/mg.svg"].default,
      },
      {
        name: "Eswatini",
        image: imageAssets["/public/images/flags/sz.svg"].default,
      },
      {
        name: "Romania",
        image: imageAssets["/public/images/flags/ro.svg"].default,
      },
      {
        name: "Antigua and Barbuda",
        image: imageAssets["/public/images/flags/ag.svg"].default,
      },
      {
        name: "Curaçao",
        image: imageAssets["/public/images/flags/cw.svg"].default,
      },
      {
        name: "Zambia",
        image: imageAssets["/public/images/flags/zm.svg"].default,
      },
      {
        name: "Zimbabwe",
        image: imageAssets["/public/images/flags/zw.svg"].default,
      },
      {
        name: "Tunisia",
        image: imageAssets["/public/images/flags/tn.svg"].default,
      },
      {
        name: "United Arab Emirates",
        image: imageAssets["/public/images/flags/ae.svg"].default,
      },
      {
        name: "Mongolia",
        image: imageAssets["/public/images/flags/mn.svg"].default,
      },
      {
        name: "Norway",
        image: imageAssets["/public/images/flags/no.svg"].default,
      },
      {
        name: "Greenland",
        image: imageAssets["/public/images/flags/gl.svg"].default,
      },
      {
        name: "Uruguay",
        image: imageAssets["/public/images/flags/uy.svg"].default,
      },
      {
        name: "Bahamas",
        image: imageAssets["/public/images/flags/bs.svg"].default,
      },
      {
        name: "Russia",
        image: imageAssets["/public/images/flags/ru.svg"].default,
      },
      {
        name: "British Virgin Islands",
        image: imageAssets["/public/images/flags/vg.svg"].default,
      },
      {
        name: "Wallis and Futuna",
        image: imageAssets["/public/images/flags/wf.svg"].default,
      },
      {
        name: "Chad",
        image: imageAssets["/public/images/flags/td.svg"].default,
      },
      {
        name: "Saint Lucia",
        image: imageAssets["/public/images/flags/lc.svg"].default,
      },
      {
        name: "Yemen",
        image: imageAssets["/public/images/flags/ye.svg"].default,
      },
      {
        name: "United States Minor Outlying Islands",
        image: imageAssets["/public/images/flags/um.svg"].default,
      },
      {
        name: "Sweden",
        image: imageAssets["/public/images/flags/se.svg"].default,
      },
      {
        name: "Svalbard and Jan Mayen",
        image: imageAssets["/public/images/flags/sj.svg"].default,
      },
      {
        name: "Laos",
        image: imageAssets["/public/images/flags/la.svg"].default,
      },
      {
        name: "Latvia",
        image: imageAssets["/public/images/flags/lv.svg"].default,
      },
      {
        name: "Colombia",
        image: imageAssets["/public/images/flags/co.svg"].default,
      },
      {
        name: "Grenada",
        image: imageAssets["/public/images/flags/gd.svg"].default,
      },
      {
        name: "Saint Barthélemy",
        image: imageAssets["/public/images/flags/bl.svg"].default,
      },
      {
        name: "Canada",
        image: imageAssets["/public/images/flags/ca.svg"].default,
      },
      {
        name: "Heard Island and McDonald Islands",
        image: imageAssets["/public/images/flags/hm.svg"].default,
      },
      {
        name: "India",
        image: imageAssets["/public/images/flags/in.svg"].default,
      },
      {
        name: "Guinea-Bissau",
        image: imageAssets["/public/images/flags/gw.svg"].default,
      },
      {
        name: "North Macedonia",
        image: imageAssets["/public/images/flags/mk.svg"].default,
      },
      {
        name: "Paraguay",
        image: imageAssets["/public/images/flags/py.svg"].default,
      },
      {
        name: "Croatia",
        image: imageAssets["/public/images/flags/hr.svg"].default,
      },
      {
        name: "Costa Rica",
        image: imageAssets["/public/images/flags/cr.svg"].default,
      },
      {
        name: "Uganda",
        image: imageAssets["/public/images/flags/ug.svg"].default,
      },
      {
        name: "Caribbean Netherlands",
        image: imageAssets["/public/images/flags/bq.svg"].default,
      },
      {
        name: "Bolivia",
        image: imageAssets["/public/images/flags/bo.svg"].default,
      },
      {
        name: "Togo",
        image: imageAssets["/public/images/flags/tg.svg"].default,
      },
      {
        name: "Mayotte",
        image: imageAssets["/public/images/flags/yt.svg"].default,
      },
      {
        name: "Marshall Islands",
        image: imageAssets["/public/images/flags/mh.svg"].default,
      },
      {
        name: "North Korea",
        image: imageAssets["/public/images/flags/kp.svg"].default,
      },
      {
        name: "Netherlands",
        image: imageAssets["/public/images/flags/nl.svg"].default,
      },
      {
        name: "British Indian Ocean Territory",
        image: imageAssets["/public/images/flags/io.svg"].default,
      },
      {
        name: "Malta",
        image: imageAssets["/public/images/flags/mt.svg"].default,
      },
      {
        name: "Mauritius",
        image: imageAssets["/public/images/flags/mu.svg"].default,
      },
      {
        name: "Norfolk Island",
        image: imageAssets["/public/images/flags/nf.svg"].default,
      },
      {
        name: "Honduras",
        image: imageAssets["/public/images/flags/hn.svg"].default,
      },
      {
        name: "Spain",
        image: imageAssets["/public/images/flags/es.svg"].default,
      },
      {
        name: "Estonia",
        image: imageAssets["/public/images/flags/ee.svg"].default,
      },
      {
        name: "Kyrgyzstan",
        image: imageAssets["/public/images/flags/kg.svg"].default,
      },
      {
        name: "Chile",
        image: imageAssets["/public/images/flags/cl.svg"].default,
      },
      {
        name: "Bermuda",
        image: imageAssets["/public/images/flags/bm.svg"].default,
      },
      {
        name: "Equatorial Guinea",
        image: imageAssets["/public/images/flags/gq.svg"].default,
      },
      {
        name: "Liberia",
        image: imageAssets["/public/images/flags/lr.svg"].default,
      },
      {
        name: "Pitcairn Islands",
        image: imageAssets["/public/images/flags/pn.svg"].default,
      },
      {
        name: "Libya",
        image: imageAssets["/public/images/flags/ly.svg"].default,
      },
      {
        name: "Liechtenstein",
        image: imageAssets["/public/images/flags/li.svg"].default,
      },
      {
        name: "Vatican City",
        image: imageAssets["/public/images/flags/va.svg"].default,
      },
      {
        name: "Christmas Island",
        image: imageAssets["/public/images/flags/cx.svg"].default,
      },
      {
        name: "Oman",
        image: imageAssets["/public/images/flags/om.svg"].default,
      },
      {
        name: "Philippines",
        image: imageAssets["/public/images/flags/ph.svg"].default,
      },
      {
        name: "Poland",
        image: imageAssets["/public/images/flags/pl.svg"].default,
      },
      {
        name: "Faroe Islands",
        image: imageAssets["/public/images/flags/fo.svg"].default,
      },
      {
        name: "Bahrain",
        image: imageAssets["/public/images/flags/bh.svg"].default,
      },
      {
        name: "Belarus",
        image: imageAssets["/public/images/flags/by.svg"].default,
      },
      {
        name: "Slovenia",
        image: imageAssets["/public/images/flags/si.svg"].default,
      },
      {
        name: "Guadeloupe",
        image: imageAssets["/public/images/flags/gp.svg"].default,
      },
      {
        name: "Qatar",
        image: imageAssets["/public/images/flags/qa.svg"].default,
      },
      {
        name: "Vietnam",
        image: imageAssets["/public/images/flags/vn.svg"].default,
      },
      {
        name: "Mauritania",
        image: imageAssets["/public/images/flags/mr.svg"].default,
      },
      {
        name: "Singapore",
        image: imageAssets["/public/images/flags/sg.svg"].default,
      },
      {
        name: "Georgia",
        image: imageAssets["/public/images/flags/ge.svg"].default,
      },
      {
        name: "Burundi",
        image: imageAssets["/public/images/flags/bi.svg"].default,
      },
      {
        name: "Nauru",
        image: imageAssets["/public/images/flags/nr.svg"].default,
      },
      {
        name: "South Sudan",
        image: imageAssets["/public/images/flags/ss.svg"].default,
      },
      {
        name: "Samoa",
        image: imageAssets["/public/images/flags/ws.svg"].default,
      },
      {
        name: "Cocos (Keeling) Islands",
        image: imageAssets["/public/images/flags/cc.svg"].default,
      },
      {
        name: "Republic of the Congo",
        image: imageAssets["/public/images/flags/cg.svg"].default,
      },
      {
        name: "Cyprus",
        image: imageAssets["/public/images/flags/cy.svg"].default,
      },
      {
        name: "Kuwait",
        image: imageAssets["/public/images/flags/kw.svg"].default,
      },
      {
        name: "Trinidad and Tobago",
        image: imageAssets["/public/images/flags/tt.svg"].default,
      },
      {
        name: "Tuvalu",
        image: imageAssets["/public/images/flags/tv.svg"].default,
      },
      {
        name: "Angola",
        image: imageAssets["/public/images/flags/ao.svg"].default,
      },
      {
        name: "Tonga",
        image: imageAssets["/public/images/flags/to.svg"].default,
      },
      {
        name: "Greece",
        image: imageAssets["/public/images/flags/gr.svg"].default,
      },
      {
        name: "Mozambique",
        image: imageAssets["/public/images/flags/mz.svg"].default,
      },
      {
        name: "Myanmar",
        image: imageAssets["/public/images/flags/mm.svg"].default,
      },
      {
        name: "Austria",
        image: imageAssets["/public/images/flags/at.svg"].default,
      },
      {
        name: "Ethiopia",
        image: imageAssets["/public/images/flags/et.svg"].default,
      },
      {
        name: "Martinique",
        image: imageAssets["/public/images/flags/mq.svg"].default,
      },
      {
        name: "Azerbaijan",
        image: imageAssets["/public/images/flags/az.svg"].default,
      },
      {
        name: "Uzbekistan",
        image: imageAssets["/public/images/flags/uz.svg"].default,
      },
      {
        name: "Bangladesh",
        image: imageAssets["/public/images/flags/bd.svg"].default,
      },
      {
        name: "Armenia",
        image: imageAssets["/public/images/flags/am.svg"].default,
      },
      {
        name: "Nigeria",
        image: imageAssets["/public/images/flags/ng.svg"].default,
      },
      {
        name: "South Africa",
        image: imageAssets["/public/images/flags/za.svg"].default,
      },
      {
        name: "Brunei",
        image: imageAssets["/public/images/flags/bn.svg"].default,
      },
      {
        name: "Italy",
        image: imageAssets["/public/images/flags/it.svg"].default,
      },
      {
        name: "Finland",
        image: imageAssets["/public/images/flags/fi.svg"].default,
      },
      {
        name: "Israel",
        image: imageAssets["/public/images/flags/il.svg"].default,
      },
      {
        name: "Aruba",
        image: imageAssets["/public/images/flags/aw.svg"].default,
      },
      {
        name: "Nicaragua",
        image: imageAssets["/public/images/flags/ni.svg"].default,
      },
      {
        name: "Haiti",
        image: imageAssets["/public/images/flags/ht.svg"].default,
      },
      {
        name: "Kiribati",
        image: imageAssets["/public/images/flags/ki.svg"].default,
      },
      {
        name: "Turks and Caicos Islands",
        image: imageAssets["/public/images/flags/tc.svg"].default,
      },
      {
        name: "Cayman Islands",
        image: imageAssets["/public/images/flags/ky.svg"].default,
      },
      {
        name: "Ukraine",
        image: imageAssets["/public/images/flags/ua.svg"].default,
      },
      {
        name: "Mexico",
        image: imageAssets["/public/images/flags/mx.svg"].default,
      },
      {
        name: "Palestine",
        image: imageAssets["/public/images/flags/ps.svg"].default,
      },
      {
        name: "Fiji",
        image: imageAssets["/public/images/flags/fj.svg"].default,
      },
      {
        name: "Slovakia",
        image: imageAssets["/public/images/flags/sk.svg"].default,
      },
      {
        name: "Ghana",
        image: imageAssets["/public/images/flags/gh.svg"].default,
      },
      {
        name: "Suriname",
        image: imageAssets["/public/images/flags/sr.svg"].default,
      },
      {
        name: "Cuba",
        image: imageAssets["/public/images/flags/cu.svg"].default,
      },
      {
        name: "Bhutan",
        image: imageAssets["/public/images/flags/bt.svg"].default,
      },
      {
        name: "Hungary",
        image: imageAssets["/public/images/flags/hu.svg"].default,
      },
      {
        name: "São Tomé and Príncipe",
        image: imageAssets["/public/images/flags/st.svg"].default,
      },
      {
        name: "Iraq",
        image: imageAssets["/public/images/flags/iq.svg"].default,
      },
      {
        name: "Czechia",
        image: imageAssets["/public/images/flags/cz.svg"].default,
      },
      {
        name: "Lithuania",
        image: imageAssets["/public/images/flags/lt.svg"].default,
      },
      {
        name: "Northern Mariana Islands",
        image: imageAssets["/public/images/flags/mp.svg"].default,
      },
      {
        name: "Botswana",
        image: imageAssets["/public/images/flags/bw.svg"].default,
      },
      {
        name: "Panama",
        image: imageAssets["/public/images/flags/pa.svg"].default,
      },
      {
        name: "Gabon",
        image: imageAssets["/public/images/flags/ga.svg"].default,
      },
      {
        name: "Ecuador",
        image: imageAssets["/public/images/flags/ec.svg"].default,
      },
    ];

    return _.shuffle(countries);
  },
};

export default fakers;
