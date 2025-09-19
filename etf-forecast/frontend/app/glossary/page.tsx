{\rtf1\ansi\ansicpg1252\cocoartf2818
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const TERMS: \{ term: string; def: string \}[] = [\
  \{ term: "P10 / P50 / P90", def: "Quantiles (10e, m\'e9dian, 90e). P10\'96P90 encadre ~80% des issus attendus par le mod\'e8le." \},\
  \{ term: "Bande 80%", def: "Zone entre P10 et P90. Plus \'e9troite = incertitude estim\'e9e plus faible (selon le mod\'e8le)." \},\
  \{ term: "MAE", def: "Mean Absolute Error \'97 erreur moyenne absolue entre pr\'e9vision et r\'e9alis\'e9 (en unit\'e9s de prix)." \},\
  \{ term: "MAPE", def: "Mean Absolute Percentage Error \'97 MAE rapport\'e9e au prix (en %)." \},\
  \{ term: "Pr\'e9cision directionnelle", def: "Proportion de jours o\'f9 la direction (hausse/baisse) pr\'e9vue est correcte." \},\
  \{ term: "Baseline na\'efve", def: "R\'e9f\'e9rence simpliste : prix(t+1) = prix(t)." \},\
  \{ term: "Volatilit\'e9", def: "Amplitude moyenne des variations de prix ; agr\'e9g\'e9e en \uc0\u8730 t dans le cadre lognormal." \},\
  \{ term: "Horizon", def: "Nombre de jours ouvr\'e9s dans le futur couverts par la pr\'e9vision." \},\
];\
export default function Glossary() \{\
  return (\
    <div className="grid gap-6">\
      <h1 className="text-2xl font-bold">Glossaire</h1>\
      <div className="grid md:grid-cols-2 gap-4">\
        \{TERMS.map((t) => (\
          <div key=\{t.term\} className="card p-4">\
            <div className="font-semibold">\{t.term\}</div>\
            <p className="text-sm text-[var(--mut)] mt-1">\{t.def\}</p>\
          </div>\
        ))\}\
      </div>\
    </div>\
  );\
\}}