{\rtf1\ansi\ansicpg1252\cocoartf2818
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const QA = [\
  ["Est-ce un conseil en investissement ?", "Non. Ce site fournit des outils statistiques indicatifs et n\'92offre aucune recommandation personnalis\'e9e."],\
  ["Pourquoi mes bandes sont larges ?", "Volatilit\'e9 \'e9lev\'e9e, faible historique exploitable ou incertitude forte pour l\'92actif \'e9tudi\'e9."],\
  ["Quelle fr\'e9quence de mise \'e0 jour ?", "\'c0 chaque chargement \'97 l\'92historique est rafra\'eechi c\'f4t\'e9 API et les pr\'e9visions sont recalcul\'e9es."],\
  ["Puis-je t\'e9l\'e9charger les donn\'e9es ?", "\'c0 venir : export CSV/PNG sur la page ETF."],\
];\
export default function FAQ() \{\
  return (\
    <div className="grid gap-6">\
      <h1 className="text-2xl font-bold">FAQ</h1>\
      <div className="grid gap-3">\
        \{QA.map(([q,a]) => (\
          <div key=\{q\} className="card p-4">\
            <div className="font-semibold">\{q\}</div>\
            <p className="text-sm text-[var(--mut)] mt-1">\{a\}</p>\
          </div>\
        ))\}\
      </div>\
    </div>\
  );\
\}}