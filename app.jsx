import React, { useState, useEffect } from 'react';
import { 
  Heart, Star, ShoppingBag, BookOpen, Gamepad2, Zap, RefreshCw, 
  ChevronRight, Info, Brain, Activity, Dna, Microscope, Stethoscope 
} from 'lucide-react';

// --- DATA ENGINE: DEFINING UNIQUE QUESTIONS PER DIFFICULTY ---
// Each topic has exactly 3 questions per difficulty level (Easy, Medium, Hard)
const TOPIC_TEMPLATES = [
  {
    name: "Reproductive System",
    icon: <Heart size={18}/>,
    levels: {
      Easy: [
        { q: "What is the primary male reproductive organ?", o: ["Testes", "Ovaries", "Uterus", "Bladder"], c: 0, h: "Produces sperm.", e: "The testes are responsible for producing sperm and testosterone." },
        { q: "Where are the female egg cells produced?", o: ["Ovaries", "Fallopian Tubes", "Vagina", "Cervix"], c: 0, h: "The almond-shaped organs.", e: "Ovaries produce eggs (ova) and hormones like estrogen." },
        { q: "The process of a sperm joining an egg is called:", o: ["Fertilization", "Ovulation", "Menstruation", "Gestation"], c: 0, h: "Creates a zygote.", e: "Fertilization is the union of male and female gametes." }
      ],
      Medium: [
        { q: "Where does fertilization usually take place?", o: ["Fallopian Tube", "Uterus", "Ovary", "Vagina"], c: 0, h: "The 'egg highway'.", e: "Fertilization typically occurs in the fallopian tubes (oviducts)." },
        { q: "What is the shedding of the uterine lining called?", o: ["Menstruation", "Ovulation", "Implantation", "Lactation"], c: 0, h: "Occurs monthly.", e: "Menstruation happens if an egg is not fertilized." },
        { q: "Which tube carries sperm from the testes to the urethra?", o: ["Vas Deferens", "Fallopian Tube", "Ureter", "Epididymis"], c: 0, h: "Part of the male duct system.", e: "The vas deferens transports mature sperm for ejaculation." }
      ],
      Hard: [
        { q: "Which hormone triggers the release of an egg (ovulation)?", o: ["Luteinizing Hormone (LH)", "Insulin", "Thyroxine", "Adrenaline"], c: 0, h: "Think 'LH surge'.", e: "A spike in LH triggers the ovary to release a mature egg." },
        { q: "What is the muscular lower part of the uterus called?", o: ["Cervix", "Vagina", "Vulva", "Endometrium"], c: 0, h: "The opening to the womb.", e: "The cervix is the narrow neck of the uterus that opens into the vagina." },
        { q: "How many chromosomes are in a human gamete (sperm/egg)?", o: ["23", "46", "22", "47"], c: 0, h: "Half of the total.", e: "Gametes are haploid, meaning they contain 23 chromosomes." }
      ]
    }
  },
  {
    name: "Chromosomal Mutations",
    icon: <Microscope size={18}/>,
    levels: {
      Easy: [
        { q: "What are DNA molecules packed into?", o: ["Chromosomes", "Ribosomes", "Lysosomes", "Vacuoles"], c: 0, h: "Thread-like structures.", e: "DNA is tightly wound into chromosomes." },
        { q: "What is the point where two chromatids touch?", o: ["Centromere", "Histone", "Telomere", "P-arm"], c: 0, h: "The central junction.", e: "The centromere holds sister chromatids together." },
        { q: "The short arm of a chromosome is called the:", o: ["p-arm", "q-arm", "d-arm", "r-arm"], c: 0, h: "p stands for 'petit'.", e: "The p-arm is the shorter section." }
      ],
      Medium: [
        { q: "Which syndrome results from having 47 chromosomes (Trisomy 21)?", o: ["Down Syndrome", "Turner Syndrome", "Klinefelter", "Cystic Fibrosis"], c: 0, h: "A numerical mutation.", e: "Down Syndrome is caused by an extra copy of chromosome 21." },
        { q: "What occurs when a segment of a chromosome is lost?", o: ["Deletion", "Inversion", "Duplication", "Translocation"], c: 0, h: "Something is missing.", e: "Deletion is a structural mutation where a piece breaks off." },
        { q: "If a segment of DNA is reversed, it is called:", o: ["Inversion", "Insertion", "Deletion", "Aneuploidy"], c: 0, h: "Flipped around.", e: "Inversion happens when a segment breaks and reattaches backwards." }
      ],
      Hard: [
        { q: "What is the primary cause of Trisomy 21 during meiosis?", o: ["Nondisjunction", "Replication Error", "Crossing Over", "Point Mutation"], c: 0, h: "Failure to separate.", e: "Nondisjunction is the failure of chromosomes to separate in Anaphase II." },
        { q: "What is 'Polyploidy' primarily associated with?", o: ["Extra complete sets", "Missing one chromosome", "Flipped segments", "Broken p-arms"], c: 0, h: "Common in plants.", e: "Polyploidy is having more than two complete sets of chromosomes." },
        { q: "Which term describes a change in a single DNA segment or entire set?", o: ["Chromosomal Mutation", "Silent Mutation", "Translation", "Transcription"], c: 0, h: "Broad structural/numerical change.", e: "Chromosomal mutations involve large-scale changes compared to point mutations." }
      ]
    }
  },
  {
    name: "DNA & RNA",
    icon: <Dna size={18}/>,
    levels: {
      Easy: [
        { q: "Which sugar is found in RNA?", o: ["Ribose", "Deoxyribose", "Glucose", "Sucrose"], c: 0, h: "Starts with R.", e: "Ribonucleic Acid contains ribose sugar." },
        { q: "Which base replaces Thymine in RNA?", o: ["Uracil", "Adenine", "Guanine", "Cytosine"], c: 0, h: "A pyrimidine unique to RNA.", e: "Uracil pairs with Adenine in RNA." },
        { q: "What does DNA stand for?", o: ["Deoxyribonucleic Acid", "Diribonucleic Acid", "Deoxynucleic Acid", "Deltanucleic Acid"], c: 0, h: "Genetic blueprint.", e: "DNA stands for Deoxyribonucleic Acid." }
      ],
      Medium: [
        { q: "The process of making mRNA from a DNA template is:", o: ["Transcription", "Translation", "Replication", "Ligation"], c: 0, h: "Occurs in the nucleus.", e: "Transcription 'writes' the code from DNA to RNA." },
        { q: "Where does Translation take place?", o: ["Ribosome", "Nucleus", "Mitochondria", "Golgi"], c: 0, h: "The protein factory.", e: "Translation happens on ribosomes in the cytoplasm." },
        { q: "A sequence of three bases on mRNA is called a:", o: ["Codon", "Anticodon", "Exon", "Intron"], c: 0, h: "Codes for one amino acid.", e: "A codon is a 3-nucleotide sequence that signals an amino acid." }
      ],
      Hard: [
        { q: "Which enzyme is responsible for unzipping the DNA strand?", o: ["Helicase", "Polymerase", "Ligase", "Amylase"], c: 0, h: "Breaks hydrogen bonds.", e: "Helicase separates the double helix for replication." },
        { q: "What type of bond holds nitrogenous bases together?", o: ["Hydrogen Bond", "Peptide Bond", "Ionic Bond", "Covalent Bond"], c: 0, h: "Weak attractions.", e: "Hydrogen bonds allow DNA to unzip and re-zip easily." },
        { q: "Which of the following is a Purine?", o: ["Guanine", "Cytosine", "Thymine", "Uracil"], c: 0, h: "Two-ringed structure.", e: "Adenine and Guanine are Purines (two fused rings)." }
      ]
    }
  },
  {
    name: "Nervous System",
    icon: <Brain size={18}/>,
    levels: {
      Easy: [
        { q: "What is the basic cell of the nervous system?", o: ["Neuron", "Nephron", "Alveoli", "Osteocyte"], c: 0, h: "Sends signals.", e: "Neurons are the structural and functional units of the nervous system." },
        { q: "The Central Nervous System consists of the Brain and:", o: ["Spinal Cord", "Nerves", "Heart", "Lungs"], c: 0, h: "Down your back.", e: "The CNS is made of the brain and spinal cord." },
        { q: "Which part of a neuron receives incoming signals?", o: ["Dendrites", "Axon", "Myelin", "Synapse"], c: 0, h: "Branch-like parts.", e: "Dendrites receive messages from other neurons." }
      ],
      Medium: [
        { q: "Which part of the brain controls balance?", o: ["Cerebellum", "Cerebrum", "Brainstem", "Thalamus"], c: 0, h: "The 'little brain'.", e: "The cerebellum handles coordination and balance." },
        { q: "The gap between two neurons is called the:", o: ["Synapse", "Axon Terminal", "Node of Ranvier", "Cell Body"], c: 0, h: "Signals jump across.", e: "A synapse is the junction where neurotransmitters cross." },
        { q: "Which system is for 'Fight or Flight' responses?", o: ["Sympathetic", "Parasympathetic", "Somatic", "Enteric"], c: 0, h: "Stress response.", e: "The Sympathetic Nervous System prepares the body for action." }
      ],
      Hard: [
        { q: "What insulates the axon to speed up signal transmission?", o: ["Myelin Sheath", "Cytoplasm", "Histone", "Ribosome"], c: 0, h: "Fatty layer.", e: "Myelin increases the speed of electrical impulses." },
        { q: "Which chemical carries signals across the synapse?", o: ["Neurotransmitter", "Hormone", "Enzyme", "Blood"], c: 0, h: "Like Dopamine.", e: "Neurotransmitters are the chemical messengers of the brain." },
        { q: "Damage to the Brainstem would primarily affect:", o: ["Involuntary Vitals", "Memory", "Vision", "Walking"], c: 0, h: "Breathing/Heart rate.", e: "The brainstem controls basic life functions like breathing." }
      ]
    }
  },
  {
    name: "Endocrine System",
    icon: <Activity size={18}/>,
    levels: {
      Easy: [
        { q: "Which gland is called the Master Gland?", o: ["Pituitary", "Thyroid", "Adrenal", "Pancreas"], c: 0, h: "In the brain.", e: "The Pituitary controls many other glands." },
        { q: "What hormone is produced by the Pancreas?", o: ["Insulin", "Adrenaline", "Estrogen", "Growth Hormone"], c: 0, h: "Regulates sugar.", e: "Insulin lowers blood glucose levels." },
        { q: "Endocrine glands release chemicals called:", o: ["Hormones", "Enzymes", "Bile", "Sweat"], c: 0, h: "Blood messengers.", e: "Hormones are chemical signals transported by blood." }
      ],
      Medium: [
        { q: "Which gland sits on top of the Kidneys?", o: ["Adrenal", "Thyroid", "Pituitary", "Ovary"], c: 0, h: "Stress glands.", e: "Adrenal glands produce adrenaline/epinephrine." },
        { q: "Goiter is often associated with which gland?", o: ["Thyroid", "Adrenal", "Pancreas", "Thymus"], c: 0, h: "In the neck.", e: "The Thyroid regulates metabolism and can swell (goiter)." },
        { q: "Which hormone is the 'female' sex hormone?", o: ["Estrogen", "Testosterone", "Insulin", "Glucagon"], c: 0, h: "Pairs with Progesterone.", e: "Estrogen is primarily produced in the ovaries." }
      ],
      Hard: [
        { q: "Which hormone increases blood sugar when it's too low?", o: ["Glucagon", "Insulin", "Thyroxine", "Melatonin"], c: 0, h: "Opposite of Insulin.", e: "Glucagon signals the liver to release stored glucose." },
        { q: "The fight-or-flight hormone is also known as:", o: ["Epinephrine", "Thyroxine", "Oxytocin", "Prolactin"], c: 0, h: "Another name for Adrenaline.", e: "Epinephrine is the scientific name for adrenaline." },
        { q: "How do hormones travel through the body?", o: ["Bloodstream", "Nerves", "Muscles", "Skin"], c: 0, h: "Long distance travel.", e: "Hormones travel via the circulatory system to target organs." }
      ]
    }
  },
  {
    name: "Biomolecules",
    icon: <ShoppingBag size={18}/>,
    levels: {
      Easy: [
        { q: "Which biomolecule is for quick energy?", o: ["Carbohydrates", "Lipids", "Proteins", "Nucleic Acids"], c: 0, h: "Sugars.", e: "Carbohydrates are the body's primary energy source." },
        { q: "What are the monomers of Proteins?", o: ["Amino Acids", "Nucleotides", "Fatty Acids", "Sugars"], c: 0, h: "20 types.", e: "Proteins are built from chains of amino acids." },
        { q: "Lipids are better known as:", o: ["Fats and Oils", "Sugars", "DNA", "Enzymes"], c: 0, h: "Non-polar molecules.", e: "Fats, oils, and waxes are all lipids." }
      ],
      Medium: [
        { q: "Which biomolecule stores genetic information?", o: ["Nucleic Acids", "Lipids", "Carbohydrates", "Proteins"], c: 0, h: "DNA and RNA.", e: "Nucleic acids carry the code for life." },
        { q: "What is the monomer of a Carbohydrate?", o: ["Monosaccharide", "Amino Acid", "Nucleotide", "Glycerol"], c: 0, h: "Simple sugar.", e: "Glucose is a common monosaccharide." },
        { q: "Which lipid makes up the cell membrane?", o: ["Phospholipids", "Triglycerides", "Steroids", "Waxes"], c: 0, h: "Has a 'head' and 'tail'.", e: "The phospholipid bilayer forms the membrane." }
      ],
      Hard: [
        { q: "What bond holds amino acids together?", o: ["Peptide Bond", "Glycosidic Bond", "Ester Bond", "Ionic Bond"], c: 0, h: "Found in proteins.", e: "Amino acids link via peptide bonds." },
        { q: "Lactose is composed of Glucose and:", o: ["Galactose", "Fructose", "Sucrose", "Ribose"], c: 0, h: "Milk sugar component.", e: "Lactose = Glucose + Galactose." },
        { q: "What is the structure of a Nucleotide?", o: ["Sugar, Base, Phosphate", "Sugar, Acid, Lipid", "Base, Lipid, Protein", "Phosphate, Acid, Base"], c: 0, h: "Three parts.", e: "Nucleotides consist of a pentose sugar, base, and phosphate." }
      ]
    }
  }
];

// Helper to shuffle and prepare questions
const generateFinalQuestions = () => {
  const allQ = [];
  TOPIC_TEMPLATES.forEach(topic => {
    ['Easy', 'Medium', 'Hard'].forEach(diff => {
      const bank = topic.levels[diff];
      bank.forEach((item, idx) => {
        const options = [...item.o].sort(() => Math.random() - 0.5);
        allQ.push({
          id: `${topic.name}-${diff}-${idx}`,
          topic: topic.name,
          topicIcon: topic.icon,
          difficulty: diff,
          question: item.q,
          options,
          correct: options.indexOf(item.o[item.c]),
          hint: item.h,
          explanation: item.e
        });
      });
    });
  });
  return allQ;
};

const ALL_QUESTIONS = generateFinalQuestions();

const SHOP_ITEMS = [
  { id: 'cake', name: 'DNA Cake', price: 200, boost: 'happiness', icon: '🍰' },
  { id: 'book', name: 'Neuro-Guide', price: 500, boost: 'intelligence', icon: '🧠' },
  { id: 'potion', name: 'Hormone Shot', price: 800, boost: 'energy', icon: '💉' },
];

export default function App() {
  const [view, setView] = useState('home'); 
  const [points, setPoints] = useState(0);
  const [pet, setPet] = useState({ name: "ScienceGotchi", level: 1, exp: 0, happiness: 100, energy: 100 });
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [lifelines, setLifelines] = useState({ hint: 5, fiftyFifty: 3 });
  const [hintActive, setHintActive] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);

  const startQuiz = (topic, difficulty) => {
    const filtered = ALL_QUESTIONS
      .filter(q => q.topic === topic && q.difficulty === difficulty)
      .sort(() => Math.random() - 0.5);
    
    setActiveQuestions(filtered);
    setQuizIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setHiddenOptions([]);
    setHintActive(false);
    setView('quiz');
    window.scrollTo(0, 0);
  };

  const handleAnswer = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const correct = activeQuestions[quizIndex].correct === idx;
    setIsCorrect(correct);

    if (correct) {
      setPoints(p => p + 100);
      setPet(p => ({ ...p, exp: p.exp + 15, happiness: Math.min(100, p.happiness + 5) }));
    } else {
      setPet(p => ({ ...p, happiness: Math.max(0, p.happiness - 10) }));
    }
  };

  const nextStep = () => {
    const nextIdx = quizIndex + 1;
    if (nextIdx < activeQuestions.length) {
      setQuizIndex(nextIdx);
      setSelectedOption(null);
      setIsCorrect(null);
      setHiddenOptions([]);
      setHintActive(false);
    } else {
      setView('home');
    }
  };

  const useLifeline = (type) => {
    if (lifelines[type] <= 0 || selectedOption !== null) return;
    setLifelines(prev => ({ ...prev, [type]: prev[type] - 1 }));
    if (type === 'hint') setHintActive(true);
    if (type === 'fiftyFifty') {
      const q = activeQuestions[quizIndex];
      const wrong = q.options.map((_, i) => i).filter(i => i !== q.correct);
      setHiddenOptions(wrong.sort(() => 0.5 - Math.random()).slice(0, 2));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center">
      {/* HEADER: PET STATUS BAR */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b-2 border-pink-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white text-xl">🧬</div>
          <div>
            <h1 className="text-sm font-black text-pink-600 uppercase tracking-tight">{pet.name}</h1>
            <div className="flex items-center gap-2">
               <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-pink-400 h-full" style={{ width: `${pet.exp % 100}%` }}></div>
               </div>
               <span className="text-[10px] font-black text-gray-400">LVL {Math.floor(pet.exp / 100) + 1}</span>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 flex items-center gap-2">
          <Star size={14} className="text-amber-500" fill="currentColor"/>
          <span className="text-sm font-black text-amber-700">{points}</span>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="w-full pt-24 pb-32 px-4 max-w-4xl">
        {view === 'home' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Pet Feature Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-2 border-pink-50 text-center">
               <div className="text-8xl mb-4 animate-bounce">🧪</div>
               <h2 className="text-2xl font-black text-slate-800">Topic Research Center</h2>
               <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100 font-black text-[10px] text-rose-500 uppercase">Happiness {pet.happiness}%</div>
                  <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 font-black text-[10px] text-blue-500 uppercase">Energy {pet.energy}%</div>
               </div>
            </div>

            {/* Topic Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {TOPIC_TEMPLATES.map(topic => (
                 <div key={topic.name} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">{topic.icon}</div>
                      <p className="font-black text-slate-800 text-sm uppercase">{topic.name}</p>
                   </div>
                   <div className="flex gap-2">
                     {['Easy', 'Medium', 'Hard'].map(diff => (
                       <button 
                         key={diff}
                         onClick={() => startQuiz(topic.name, diff)}
                         className={`flex-1 py-3 text-[10px] font-black rounded-xl border-b-4 transition-all active:translate-y-1 active:border-b-0
                           ${diff === 'Easy' ? 'bg-emerald-500 border-emerald-700 text-white' : 
                             diff === 'Medium' ? 'bg-amber-500 border-amber-700 text-white' : 
                             'bg-rose-500 border-rose-700 text-white'}`}
                       >
                         {diff}
                       </button>
                     ))}
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {view === 'quiz' && activeQuestions[quizIndex] && (
          <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
             {/* Question Card */}
             <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 text-center relative mt-10">
                <span className="bg-indigo-600 text-white text-[10px] font-black px-6 py-2 rounded-full absolute -top-4 left-1/2 -translate-x-1/2 shadow-lg uppercase tracking-widest">
                  {activeQuestions[quizIndex].topic} • {activeQuestions[quizIndex].difficulty}
                </span>
                <h2 className="text-3xl font-black text-slate-800 leading-tight mb-4 pt-4">
                  {activeQuestions[quizIndex].question}
                </h2>
                {hintActive && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-700 font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
                    <Info size={16}/> {activeQuestions[quizIndex].hint}
                  </div>
                )}
             </div>

             {/* Options Grid */}
             <div className="grid grid-cols-1 gap-4">
                {activeQuestions[quizIndex].options.map((opt, idx) => {
                  const isCorrectIdx = activeQuestions[quizIndex].correct === idx;
                  const isSelected = selectedOption === idx;
                  const isHidden = hiddenOptions.includes(idx);

                  let btnClass = "bg-white border-slate-200 text-slate-800 hover:border-indigo-400 hover:shadow-md";
                  if (selectedOption !== null) {
                    if (isCorrectIdx) btnClass = "bg-emerald-500 border-emerald-700 text-white scale-[1.02] shadow-xl";
                    else if (isSelected) btnClass = "bg-rose-500 border-rose-700 text-white";
                    else btnClass = "bg-slate-50 border-slate-100 opacity-40";
                  }
                  if (isHidden) btnClass = "opacity-0 pointer-events-none translate-y-4";

                  return (
                    <button 
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={selectedOption !== null}
                      className={`p-6 rounded-[2rem] border-b-4 text-left font-black text-lg transition-all duration-300 ${btnClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
             </div>

             {/* Feedback & Continue */}
             {selectedOption !== null && (
               <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-2 border-indigo-100 space-y-6 animate-in slide-in-from-bottom-8 duration-500">
                  <div className="flex items-center gap-4">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                        {isCorrect ? '✨' : '🧬'}
                     </div>
                     <div>
                        <p className={`text-xl font-black uppercase ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isCorrect ? 'Excellent Discovery!' : 'Observation Denied'}
                        </p>
                        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Research Analysis</p>
                     </div>
                  </div>
                  <p className="text-md text-slate-600 leading-relaxed font-bold italic bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    "{activeQuestions[quizIndex].explanation}"
                  </p>
                  <button 
                    onClick={nextStep}
                    className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                  >
                    CONTINUE RESEARCH <ChevronRight size={20}/>
                  </button>
               </div>
             )}

             {/* Lifelines */}
             {selectedOption === null && (
               <div className="flex gap-4">
                  <button onClick={() => useLifeline('fiftyFifty')} className="flex-1 bg-white p-5 rounded-[2rem] border-b-4 border-slate-200 text-[10px] font-black text-slate-500 uppercase flex flex-col items-center gap-2 shadow-sm hover:border-indigo-400 hover:text-indigo-600 transition-all">
                    <span className="text-2xl">🌓</span> 50/50 ({lifelines.fiftyFifty})
                  </button>
                  <button onClick={() => useLifeline('hint')} className="flex-1 bg-white p-5 rounded-[2rem] border-b-4 border-slate-200 text-[10px] font-black text-slate-500 uppercase flex flex-col items-center gap-2 shadow-sm hover:border-indigo-400 hover:text-indigo-600 transition-all">
                    <span className="text-2xl">💡</span> HINT ({lifelines.hint})
                  </button>
               </div>
             )}
          </div>
        )}

        {view === 'shop' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
             <div className="bg-amber-500 p-10 rounded-[3rem] text-white shadow-xl flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl font-black uppercase tracking-tighter">BIOLOGY LAB</h2>
                  <p className="text-amber-100 font-bold opacity-80">Enhance your specimen's capabilities.</p>
                </div>
                <div className="bg-black/20 px-6 py-4 rounded-2xl font-black text-3xl backdrop-blur-md">🪙 {points}</div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SHOP_ITEMS.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      if (points >= item.price) {
                        setPoints(p => p - item.price);
                        setPet(p => ({ ...p, happiness: Math.min(100, p.happiness + 20) }));
                      }
                    }}
                    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex items-center justify-between group active:scale-95 transition-all hover:border-amber-400"
                  >
                    <div className="flex items-center gap-5">
                      <span className="text-5xl transition-transform group-hover:scale-110">{item.icon}</span>
                      <div className="text-left">
                        <p className="font-black text-slate-800 text-lg">{item.name}</p>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">+{item.boost}</p>
                      </div>
                    </div>
                    <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-black text-sm">{item.price}</div>
                  </button>
                ))}
             </div>
          </div>
        )}
      </main>

      {/* NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-t-2 border-pink-100 p-3 pb-10 flex justify-around shadow-lg">
        {[
          { id: 'home', icon: BookOpen, label: 'Learn' },
          { id: 'shop', icon: ShoppingBag, label: 'Shop' },
          { id: 'review', icon: RefreshCw, label: 'Review' }
        ].map(btn => (
          <button 
            key={btn.id}
            onClick={() => setView(btn.id)}
            className={`flex flex-col items-center gap-1 px-8 py-2 rounded-2xl transition-all ${view === btn.id ? 'bg-pink-500 text-white scale-110 shadow-lg' : 'text-gray-400 hover:text-pink-400'}`}
          >
            <btn.icon size={22} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{btn.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
