<?php

namespace App\Service;

class AIService
{
    private array $knowledgeBase = [
        'flu' => [
            'symptoms' => ['fever', 'cough', 'sore throat', 'body ache', 'ջերմություն', 'հազ', 'կոկորդի ցավ', 'температура', 'кашель', 'грипп'],
            'department' => 'General Medicine',
            'urgency' => 'regular'
        ],
        'cold' => [
            'symptoms' => ['sneezing', 'runny nose', 'mild cough', 'մրսածություն', 'փռշտոց', 'նասմորկ', 'насморк', 'простуда'],
            'department' => 'General Medicine',
            'urgency' => 'regular'
        ],
        'cardiac' => [
            'symptoms' => ['chest pain', 'shortness of breath', 'dizziness', 'heart', 'կրծքավանդակի ցավ', 'շնչահեղձություն', 'սիրտ', 'боль в груди', 'одышка', 'сердце'],
            'department' => 'Cardiology',
            'urgency' => 'urgent'
        ],
        'dermatology' => [
            'symptoms' => ['rash', 'itching', 'skin redness', 'acne', 'ցան', 'քոր', 'մաշկի', 'сыпь', 'зуд', 'кожа'],
            'department' => 'Dermatology',
            'urgency' => 'regular'
        ],
        'gastrology' => [
            'symptoms' => ['stomach pain', 'nausea', 'bloating', 'stomach', 'ստամոքսի ցավ', 'սրտխառնոց', 'փորացավ', 'боль в животе', 'тошнота', 'желудок'],
            'department' => 'Gastroenterology',
            'urgency' => 'regular'
        ],
        'neurology' => [
            'symptoms' => ['headache', 'migraine', 'numbness', 'գլխացավ', 'միգրեն', 'թմրածություն', 'головная боль', 'мигрень', 'онемение'],
            'department' => 'Neurology',
            'urgency' => 'regular'
        ],
        'orthopedics' => [
            'symptoms' => ['bone pain', 'joint pain', 'fracture', 'back pain', 'ոսկրերի ցավ', 'հոդացավ', 'մեջքի ցավ', 'կոտրվածք', 'боль в суставах', 'боль в спине', 'перелом'],
            'department' => 'Orthopedics',
            'urgency' => 'urgent'
        ],
        'dentistry' => [
            'symptoms' => ['toothache', 'bleeding gums', 'ատամի ցավ', 'լնդերի արյունահոսություն', 'зубная боль', 'десны'],
            'department' => 'Dentistry',
            'urgency' => 'regular'
        ],
        'ophthalmology' => [
            'symptoms' => ['blurry vision', 'eye pain', 'red eye', 'աչքի ցավ', 'տեսողության վատացում', 'աչք', 'боль в глазах', 'зрение'],
            'department' => 'Ophthalmology',
            'urgency' => 'regular'
        ],
        'pediatrics' => [
            'symptoms' => ['child fever', 'baby crying', 'երեխայի ջերմություն', 'երեխա', 'температура у ребенка', 'ребенок'],
            'department' => 'Pediatrics',
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
                if (str_contains($input, $symptom)) {
                    $matchCount++;
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

        // Conversational Intents (Greetings, Yes/No)
        $greetings = ['hi', 'hello', 'hey', 'բարև', 'ողջույն', 'привет', 'здравствуйте'];
        $affirmative = ['yes', 'yeah', 'ok', 'okay', 'այո', 'հա', 'да', 'хорошо'];
        $negative = ['no', 'nope', 'ոչ', 'չէ', 'нет'];

        foreach ($greetings as $word) {
            if (str_contains($input, $word)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'greeting',
                    'translationKey' => 'home.aiChat.response.greeting'
                ];
            }
        }

        foreach ($affirmative as $word) {
            if (str_contains($input, $word)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'affirmative',
                    'translationKey' => 'home.aiChat.response.affirmative'
                ];
            }
        }

        foreach ($negative as $word) {
            if (str_contains($input, $word)) {
                return [
                    'status' => 'conversational',
                    'intent' => 'negative',
                    'translationKey' => 'home.aiChat.response.negative'
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
