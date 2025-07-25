// おみくじの結果データ
const omikujiResults = [
    {
        name: '大吉',
        video: 'douga/omikuji_result_1.mp4',
        description: '最高の運勢です！何事も順調に進むでしょう。新しいことにチャレンジするのに最適な時期です。'
    },
    {
        name: '中吉',
        video: 'douga/omikuji_result_2.mp4',
        description: '良い運勢です。努力が実を結び、望んでいた結果が得られそうです。'
    },
    {
        name: '小吉',
        video: 'douga/omikuji_result_3.mp4',
        description: 'まずまずの運勢です。小さな幸せが訪れるでしょう。焦らず着実に進みましょう。'
    },
    {
        name: '吉',
        video: 'douga/omikuji_result_4.mp4',
        description: '穏やかな運勢です。平和で安定した日々が続くでしょう。'
    },
    {
        name: '末吉',
        video: 'douga/omikuji_result_4.mp4', // 同じ動画を使用
        description: '後半に向けて運気が上昇します。忍耐強く待つことが大切です。'
    },
    {
        name: '凶',
        video: 'douga/omikuji_result_9.mp4',
        description: '注意が必要な時期です。慎重に行動し、無理をしないようにしましょう。'
    },
    {
        name: '大凶',
        video: 'douga/omikuji_result_9.mp4',
        description: '困難な時期ですが、これを乗り越えれば必ず良いことが待っています。希望を失わずに。'
    }
];

// DOM要素の取得
const omikujiButton = document.getElementById('omikujiButton');
const drawingModal = document.getElementById('drawingModal');
const resultModal = document.getElementById('resultModal');
const drawingVideo = document.getElementById('drawingVideo');
const resultVideo = document.getElementById('resultVideo');
const resultText = document.getElementById('resultText');
const resultDescription = document.getElementById('resultDescription');
const closeButton = document.getElementById('closeButton');
const backgroundVideo = document.getElementById('backgroundVideo');

// 動画の読み込み状態を管理
let videosLoaded = false;

// 動画の事前読み込み
function preloadVideos() {
    const videoPromises = omikujiResults.map(result => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.src = result.video;
            video.addEventListener('canplaythrough', resolve);
            video.addEventListener('error', resolve); // エラーでも続行
            video.load();
        });
    });
    
    Promise.all(videoPromises).then(() => {
        videosLoaded = true;
        console.log('すべての動画の読み込みが完了しました');
    });
}

// ページ読み込み時に動画を事前読み込み
window.addEventListener('load', () => {
    preloadVideos();
    
    // 背景動画の再生を確実にする
    backgroundVideo.play().catch(e => {
        console.log('背景動画の自動再生に失敗しました:', e);
    });
});

// おみくじボタンのクリックイベント
omikujiButton.addEventListener('click', startOmikuji);

// おみくじ開始
function startOmikuji() {
    // ボタンを無効化
    omikujiButton.disabled = true;
    
    // 背景動画を停止
    backgroundVideo.pause();
    
    // おみくじ実行中モーダルを表示
    drawingModal.style.display = 'block';
    
    // おみくじ実行動画を再生
    drawingVideo.currentTime = 0;
    drawingVideo.play().catch(e => {
        console.log('おみくじ動画の再生に失敗しました:', e);
    });
    
    // 動画終了後に結果を表示
    drawingVideo.addEventListener('ended', showResult, { once: true });
}

// 結果表示
function showResult() {
    // おみくじ実行中モーダルを非表示
    drawingModal.style.display = 'none';
    
    // ランダムで結果を選択
    const randomIndex = Math.floor(Math.random() * omikujiResults.length);
    const result = omikujiResults[randomIndex];
    
    // 結果テキストを設定
    resultText.textContent = result.name;
    resultDescription.textContent = result.description;
    
    // 結果動画を設定
    resultVideo.src = result.video;
    resultVideo.load();
    
    // 結果モーダルを表示
    resultModal.style.display = 'block';
    
    // 結果動画を再生
    resultVideo.play().catch(e => {
        console.log('結果動画の再生に失敗しました:', e);
    });
    
    // 結果をコンソールに出力（デバッグ用）
    console.log(`おみくじ結果: ${result.name}`);
}

// モーダルを閉じる
closeButton.addEventListener('click', closeModal);

function closeModal() {
    // 結果モーダルを非表示
    resultModal.style.display = 'none';
    
    // 動画を停止
    resultVideo.pause();
    resultVideo.currentTime = 0;
    
    // 背景動画を再開
    backgroundVideo.currentTime = 0;
    backgroundVideo.play().catch(e => {
        console.log('背景動画の再生に失敗しました:', e);
    });
    
    // ボタンを有効化
    omikujiButton.disabled = false;
}

// モーダル外クリックで閉じる
resultModal.addEventListener('click', (e) => {
    if (e.target === resultModal) {
        closeModal();
    }
});

// キーボードイベント（ESCキーで閉じる）
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (resultModal.style.display === 'block') {
            closeModal();
        }
    }
});

// スマートフォンでの動画再生対応
function enableVideoPlayback() {
    // ユーザーインタラクション後に動画再生を有効化
    document.addEventListener('touchstart', function enableTouch() {
        backgroundVideo.play().catch(e => {
            console.log('タッチ後の背景動画再生に失敗:', e);
        });
        document.removeEventListener('touchstart', enableTouch);
    }, { once: true });
}

// モバイルデバイスの検出
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// モバイルデバイスの場合の初期化
if (isMobileDevice()) {
    enableVideoPlayback();
    
    // モバイルでの動画最適化
    document.querySelectorAll('video').forEach(video => {
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
    });
}

// エラーハンドリング
window.addEventListener('error', (e) => {
    console.error('エラーが発生しました:', e.error);
});

// 動画エラーハンドリング
document.querySelectorAll('video').forEach(video => {
    video.addEventListener('error', (e) => {
        console.error('動画エラー:', e.target.src, e);
    });
});

// パフォーマンス最適化: Intersection Observer for lazy loading
if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                if (video.dataset.src) {
                    video.src = video.dataset.src;
                    video.load();
                    videoObserver.unobserve(video);
                }
            }
        });
    });
    
    // 必要に応じて遅延読み込みを適用
    // videoObserver.observe(someVideo);
}

// デバッグ情報
console.log('おみくじWebサイトが初期化されました');
console.log('利用可能な結果:', omikujiResults.map(r => r.name));
