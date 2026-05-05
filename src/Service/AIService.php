<?php

namespace App\Service;

class AIService
{
    private array $knowledgeBase = [
        'flu' => [
            'symptoms' => ['fever', 'cough', 'sore throat', 'body ache', 'ջերմություն', 'հազ', 'կոկորդի ցավ', 'температура', 'кашель', 'грипп', 'вирус', 'hivand', 'satkum', 'vat'],
            'department' => 'General Medicine',
            'urgency' => 'regular'
        ],
        'cold' => [
            'symptoms' => ['sneezing', 'runny nose', 'mild cough', 'մրսածություն', 'փռշտոց', 'նասմորկ', 'насморк', 'простуда'],
            'department' => 'General Medicine',
            'urgency' => 'regular'
        ],
        'cardiac' => [
            'symptoms' => ['chest pain', 'shortness of breath', 'dizziness', 'heart', 'կրծքավանդակի ցավ', 'շնչահեղձություն', 'սիրտ', 'боль в груди', 'одышка', 'сердце', 'пульс', 'pulse', 'srtic', 'serte', 'shunch'],
            'department' => 'Cardiology',
            'urgency' => 'urgent'
        ],
        'dermatology' => [
            'symptoms' => ['rash', 'itching', 'skin redness', 'acne', 'ցան', 'քոր', 'մաշկի', 'сыпь', 'зуд', 'кожа', 'պրիշիկ', 'прыщи'],
            'department' => 'Dermatology',
            'urgency' => 'regular'
        ],
        'gastrology' => [
            'symptoms' => ['stomach pain', 'nausea', 'bloating', 'stomach', 'ստամոքսի ցավ', 'սրտխառնոց', 'փորացավ', 'боль в животе', 'тошнота', 'желудок', 'диզենտերիա', 'poracav', 'stamoqs', 'srtkharnoc'],
            'department' => 'Gastroenterology',
            'urgency' => 'regular'
        ],
        'neurology' => [
            'symptoms' => ['headache', 'migraine', 'numbness', 'գլխացավ', 'միգրեն', 'թմրածություն', 'головная боль', 'мигрень', 'онемение', 'головокружение', 'glkhacav', 'migren'],
            'department' => 'Neurology',
            'urgency' => 'regular'
        ],
        'orthopedics' => [
            'symptoms' => ['bone pain', 'joint pain', 'fracture', 'back pain', 'ոսկրերի ցավ', 'հոդացավ', 'մեջքի ցավ', 'կոտրվածք', 'боль в суставах', 'боль в спине', 'перелом', 'травма', 'վնասվածք'],
            'department' => 'Orthopedics',
            'urgency' => 'urgent'
        ],
        'dentistry' => [
            'symptoms' => ['toothache', 'bleeding gums', 'ատամի ցավ', 'լնդերի արյունահոսություն', 'зубная боль', 'десны', 'ատամ', 'зуб'],
            'department' => 'Dentistry',
            'urgency' => 'regular'
        ],
        'ophthalmology' => [
            'symptoms' => ['blurry vision', 'eye pain', 'red eye', 'աչքի ցավ', 'տեսողության վատացում', 'աչք', 'боль в глазах', 'зрение', 'глаз'],
            'department' => 'Ophthalmology',
            'urgency' => 'regular'
        ],
        'pediatrics' => [
            'symptoms' => ['child fever', 'baby crying', 'երեխայի ջերմություն', 'երեխա', 'температура у ребенка', 'ребенок', 'մանկաբույժ'],
            'department' => 'Pediatrics',
            'urgency' => 'regular'
        ],
        'urology' => [
            'symptoms' => ['kidney', 'urinary', 'bladder', 'երիկամ', 'միզապարկ', 'почки', 'мочевой пузырь'],
            'department' => 'Urology',
            'urgency' => 'regular'
        ],
        'psychology' => [
            'symptoms' => ['anxiety', 'depression', 'stress', 'տագնապ', 'դեպրեսիա', 'սթրես', 'тревога', 'депрессия', 'стресс'],
            'department' => 'Psychology',
            'urgency' => 'regular'
        ],
        'endocrinology' => [
            'symptoms' => ['diabetes', 'thyroid', 'hormone', 'դիաբետ', 'շաքարախտ', 'щитовидка', 'диабет'],
            'department' => 'Endocrinology',
            'urgency' => 'regular'
        ]
    ];

    public function analyzeSymptoms(string $input): array
    {
        $input = strtolower($input);
        $matches = [];
        $highestMatchCount = 0;
        $bestDisease = null;

        foreach ($this->knowledgeBase as $disease => $data) {
            $matchCount = 0;
            foreach ($data['symptoms'] as $symptom) {
                
                if (preg_match('/[a-zA-Z]/', $symptom)) {
                    if (preg_match('/\b' . preg_quote($symptom, '/') . '\b/i', $input)) {
                        $matchCount++;
                    }
                } else {
                    
                    if (str_contains($input, $symptom)) {
                        $matchCount++;
                    }
                }
            }

            if ($matchCount > $highestMatchCount) {
                $highestMatchCount = $matchCount;
                $bestDisease = $disease;
            }
        }

        if ($bestDisease) {
            return [
                'status' => 'success',
                'disease' => $bestDisease,
                'department' => $this->knowledgeBase[$bestDisease]['department'],
                'urgency' => $this->knowledgeBase[$bestDisease]['urgency'],
                'recommendation' => $this->getRecommendation($bestDisease)
            ];
        }

        
        $greetings = ['hi', 'hello', 'hey', 'բարև', 'ողջույն', 'привет', 'здравствуйте', 'barev', 'voghjuyn'];
        $affirmative = ['yes', 'yeah', 'ok', 'okay', 'այո', 'հա', 'да', 'хорошо', 'ayo', 'ha'];
        $negative = ['no', 'nope', 'ոչ', 'չէ', 'нет', 'voch', 'che'];

        foreach ($greetings as $word) {
            if (preg_match('/\b' . preg_quote($word, '/') . '\b/i', $input)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'greeting',
                    'translationKey' => 'home.aiChat.response.greeting'
                ];
            }
        }

        foreach ($affirmative as $word) {
            if (preg_match('/\b' . preg_quote($word, '/') . '\b/i', $input)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'affirmative',
                    'translationKey' => 'home.aiChat.response.affirmative',
                    'redirect' => 'hospitals'
                ];
            }
        }

        foreach ($negative as $word) {
            if (preg_match('/\b' . preg_quote($word, '/') . '\b/i', $input)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'negative',
                    'translationKey' => 'home.aiChat.response.negative'
                ];
            }
        }

        
        $helpKeywords = ['help', 'info', 'support', 'օգնություն', 'помощь', 'инфо', 'տեղեկություն', 'ognutyun'];
        foreach ($helpKeywords as $word) {
            if (preg_match('/\b' . preg_quote($word, '/') . '\b/i', $input)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'help',
                    'translationKey' => 'home.aiChat.response.help',
                    'image' => '/img/help/support.png'
                ];
            }
        }

        $emailKeywords = ['email', 'mail', 'փոստ', 'почта', 'էլեկտրոնային', 'post'];
        foreach ($emailKeywords as $word) {
            if (preg_match('/\b' . preg_quote($word, '/') . '\b/i', $input)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'email',
                    'translationKey' => 'home.aiChat.response.mail',
                    'image' => '/img/help/contact.png'
                ];
            }
        }

        
        $thanksKeywords = ['thanks', 'thank you', 'merci', 'շնորհակալություն', 'ապրես', 'спасибо', 'благодарю', 'shnorhakalutyun', 'apres'];
        foreach ($thanksKeywords as $word) {
            if (preg_match('/\b' . preg_quote($word, '/') . '\b/i', $input)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'thanks',
                    'translationKey' => 'home.aiChat.response.thanks'
                ];
            }
        }

        
        $whoKeywords = ['who are you', 'what are you', 'your name', 'ով ես', 'ինչ ես', 'кто ты', 'как тебя зовут', 'ov es'];
        foreach ($whoKeywords as $word) {
            if (str_contains($input, $word)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'whoAreYou',
                    'translationKey' => 'home.aiChat.response.whoAreYou'
                ];
            }
        }

        
        $howAreYouKeywords = ['how are you', 'how is it going', 'ոնց ես', 'ինչպես ես', 'как дела', 'как ты', 'vonc es'];
        foreach ($howAreYouKeywords as $word) {
            if (str_contains($input, $word)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'howAreYou',
                    'translationKey' => 'home.aiChat.response.howAreYou'
                ];
            }
        }

        
        $byeKeywords = ['bye', 'goodbye', 'see you', 'ցտեսություն', 'հաջող', 'пока', 'до свидания', 'hajogh'];
        foreach ($byeKeywords as $word) {
            if (preg_match('/\b' . preg_quote($word, '/') . '\b/i', $input)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'goodbye',
                    'translationKey' => 'home.aiChat.response.goodbye'
                ];
            }
        }

        
        $priceKeywords = ['price', 'cost', 'how much', 'արժեք', 'գին', 'цена', 'сколько стоит'];
        foreach ($priceKeywords as $word) {
            if (str_contains($input, $word)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'pricing',
                    'translationKey' => 'home.aiChat.response.pricing'
                ];
            }
        }

        
        $locationKeywords = ['where', 'location', 'address', 'որտեղ', 'հասցե', 'տեղ', 'где', 'адрес', 'место'];
        foreach ($locationKeywords as $word) {
            if (str_contains($input, $word)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'location',
                    'translationKey' => 'home.aiChat.response.location'
                ];
            }
        }

        
        $hoursKeywords = ['hours', 'working', 'time', 'when', 'ժամ', 'երբ', 'время', 'когда', 'часы'];
        foreach ($hoursKeywords as $word) {
            if (str_contains($input, $word)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'workingHours',
                    'translationKey' => 'home.aiChat.response.workingHours'
                ];
            }
        }

        return [
            'status' => 'unknown',
            'translationKey' => 'home.aiChat.response.default',
            'message' => 'I could not determine a specific condition. Please consult a general practitioner.'
        ];
    }

    private function getRecommendation(string $disease): string
    {
        $data = $this->knowledgeBase[$disease];
        if ($data['urgency'] === 'urgent') {
            return "This condition may be serious. Please visit a " . $data['department'] . " specialist IMMEDIATELY.";
        }
        return "We recommend scheduling an appointment with our " . $data['department'] . " department.";
    }
}
