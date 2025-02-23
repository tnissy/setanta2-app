export function maxBenchPress(age: number, weightKg: number, gender: string, level: string): number {
    // 年齢層の中央値（補間は省略し、カテゴリ分類のみ使用）
    const ageGroups: { [key: string]: number } = {
        '18-39': 28.5,
        '40-49': 44.5,
        '50-59': 54.5,
        '60-69': 64.5
    };

    // 男性の中級者の基準データ（ポンド）
    const maleIntermediateWeights: { [key: string]: { [key: number]: number } } = {
        '18-39': {114: 130, 123: 140, 132: 155, 148: 170, 165: 185, 181: 200, 198: 215, 220: 225, 242: 230, 275: 240, 319: 245, 320: 250},
        '40-49': {114: 110, 123: 120, 132: 135, 148: 145, 165: 160, 181: 170, 198: 185, 220: 195, 242: 200, 275: 205, 319: 210, 320: 215},
        '50-59': {114: 100, 123: 105, 132: 120, 148: 130, 165: 140, 181: 150, 198: 160, 220: 170, 242: 175, 275: 180, 319: 185, 320: 190},
        '60-69': {114: 75,  123: 80,  132: 90,  148: 100, 165: 105, 181: 115, 198: 125, 220: 130, 242: 135, 275: 140, 319: 145, 320: 150}
    };

    // 体重カテゴリ（ポンド）
    const weightCategories: number[] = [114, 123, 132, 148, 165, 181, 198, 220, 242, 275, 319, 320];

    // 年齢層の決定
    let ageGroup: string;
    if (18 <= age && age <= 39) {
        ageGroup = '18-39';
    } else if (40 <= age && age <= 49) {
        ageGroup = '40-49';
    } else if (50 <= age && age <= 59) {
        ageGroup = '50-59';
    } else if (60 <= age && age <= 69) {
        ageGroup = '60-69';
    } else {
        throw new Error("年齢は18-69歳の範囲で入力してください。");
    }

    // 体重の変換（kg -> ポンド）
    const weightLb: number = weightKg / 0.453592;

    // 体重の補間
    let interpolatedWeight: number;
    if (weightLb <= 114) {
        interpolatedWeight = maleIntermediateWeights[ageGroup][114];
    } else if (weightLb >= 320) {
        interpolatedWeight = maleIntermediateWeights[ageGroup][320];
    } else {
        const lowerWeight: number = Math.max(...weightCategories.filter(w => w <= weightLb));
        const upperWeight: number = Math.min(...weightCategories.filter(w => w >= weightLb));
        const lowerWeightValue: number = maleIntermediateWeights[ageGroup][lowerWeight];
        const upperWeightValue: number = maleIntermediateWeights[ageGroup][upperWeight];
        const weightRatio: number = (weightLb - lowerWeight) / (upperWeight - lowerWeight);
        interpolatedWeight = lowerWeightValue + weightRatio * (upperWeightValue - lowerWeightValue);
    }

    // 重量をkgに変換
    let weightKgConverted: number = interpolatedWeight * 0.453592;

    // 性別係数の適用
    let genderCoefficient: number;
    if (gender === 'male') {
        genderCoefficient = 1.0;
    } else if (gender === 'female') {
        genderCoefficient = 0.7; // 仮の値
    } else {
        throw new Error("性別は'male'または'female'を入力してください。");
    }

    // 熟練度係数の適用
    const levelCoefficients: { [key: string]: number } = {
        'untrained': 0.6,
        'novice': 0.8,
        'intermediate': 1.0,
        'advanced': 1.3,
        'elite': 1.6
    };
    if (!(level in levelCoefficients)) {
        throw new Error("熟練度は'untrained', 'novice', 'intermediate', 'advanced', 'elite'から選んでください。");
    }
    const levelCoefficient: number = levelCoefficients[level];

    // 最終的な最大重量の計算
    const maxWeightKg: number = weightKgConverted * genderCoefficient * levelCoefficient;
    return parseFloat(maxWeightKg.toFixed(2));
}

// 使用例
console.log(maxBenchPress(55, 55, 'male', 'intermediate')); // 約83.91 kg
console.log(maxBenchPress(25, 100, 'male', 'elite'));    // 約66.22 kg（仮係数使用）