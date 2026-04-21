
(function () {
    'use strict';

    function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function randFloat(min, max) { return (Math.random() * (max - min) + min).toFixed(2); }
    function randItem(arr) { return arr[randInt(0, arr.length - 1)]; }
    function randDate(daysBack) {
        const d = new Date();
        d.setDate(d.getDate() - randInt(0, daysBack));
        return d.toLocaleDateString('tr-TR');
    }
    function randTime() { return `${String(randInt(8, 18)).padStart(2, '0')}:${String(randInt(0, 59)).padStart(2, '0')}`; }

    const NAMES = ['Ahmet Yılmaz', 'Elif Demir', 'Mehmet Kara', 'Ayşe Çelik', 'Fatma Öztürk', 'Ali Koç', 'Zeynep Arslan', 'Mustafa Şahin', 'Hülya Aydın', 'Emre Güneş', 'Selin Aktaş', 'Burak Yıldız', 'Derya Kaya', 'Okan Turan', 'Gizem Polat'];
    const SELLERS = ['SLR-10284', 'SLR-20491', 'SLR-30182', 'SLR-40293', 'SLR-50172', 'SLR-60394', 'SLR-70281', 'SLR-80192', 'SLR-90345', 'SLR-11278'];
    const BRANCHES = ['İstanbul Anadolu', 'İstanbul Avrupa', 'Ankara Merkez', 'İzmir Bornova', 'Bursa Nilüfer', 'Antalya Konyaaltı', 'Kocaeli Gebze', 'Gaziantep Şahinbey', 'Konya Selçuklu', 'Adana Çukurova', 'Mersin Tarsus', 'Trabzon Ortahisar'];
    const XDOCK_IDS = ['XDOCK-001', 'XDOCK-002', 'XDOCK-003', 'XDOCK-004', 'XDOCK-005', 'XDOCK-006', 'XDOCK-007', 'XDOCK-008'];
    const STATUSES = ['Aktif', 'Beklemede', 'Tamamlandı', 'İptal'];
    const STATUS_CLASSES = { 'Aktif': 'success', 'Beklemede': 'warning', 'Tamamlandı': 'info', 'İptal': 'danger' };
    const ALARM_TYPES = ['Gecikme', 'Hasar', 'Kayıp', 'Yanlış Teslimat', 'Adres Hatası', 'Müşteri İadesi'];
    const TAZMIN_REASONS = ['Hasar', 'Kayıp Gönderi', 'Geç Teslimat', 'Yanlış Ürün', 'Eksik Ürün'];

    function warningBanner() {
        return `<div class="dream-warning-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>Veriler gerçekliği yansıtmamaktadır.</span>
        </div>`;
    }

    const screenData = {
        'alarm-skala': { title: 'Skala', icon: '' },
        'alarmlar': { title: 'Alarmlar', icon: '' },
        'kronik-seller': { title: 'Tazmin Kronik Seller', icon: '' },
        'kalite-itiraz': { title: 'Kalite', icon: '' },
        'eksik-surem': { title: 'Eksik Sürem', icon: '' },
        'form': { title: 'Form', icon: '' },

        'seller-kabul': { title: 'Seller Bazlı Kabulü Yapılmış Gönderiler', icon: '' },
        'fm-seller': { title: 'FM Operations Seller List', icon: '' },
        'kargo-termin': { title: 'Kargo Termin Durumu', icon: '' },
        'sx-dwh': { title: 'SX Toplu Veri Aratma (DWH)', icon: '' },
        'desi-itiraz': { title: 'Desi İtiraz Sonuçları', icon: '' },
        'tazmin-rapor': { title: 'Tazmin Gönderi Raporu (MT Kullanım Raporu)', icon: '' },

        'lojistik': { title: 'Lojistik', icon: '' },
        'tdesk': { title: 'Tdesk', icon: '' },
        'magaza-toplama': { title: 'Mağaza Toplama Gönderi Bazlı', icon: '' },
        'geri-aranacak': { title: 'Geri Aranacak Satıcı Bilgisi', icon: '' },
        'hinterland': { title: 'LM Toplama Hinterland Check', icon: '' },
        'seller-desi': { title: 'Seller Desi Şikayetleri from Slack', icon: '' },
        'fm-area': { title: 'FM Operations Area Responsible', icon: '' },
    };

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    let activeScreen = null;


    function renderFakeScreen() {
        return `
            <div class="fake-screen">
                <div class="fake-screen-inner">
                    <div class="fake-screen-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                            <line x1="8" y1="21" x2="16" y2="21"/>
                            <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                    </div>
                    <div class="fake-screen-text">Hayali Ekran</div>
                </div>
            </div>`;
    }

    function renderEksikSurem() {
        const today = new Date();
        const entries = [];
        const dayCount = randInt(15, 25);
        let toplamDk = 0;
        for (let i = 0; i < dayCount; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const eksikDk = randInt(5, 120);
            toplamDk += eksikDk;
            entries.push({ tarih: d.toLocaleDateString('tr-TR'), eksikDk });
        }
        const rows = entries.map(e => `<tr>
            <td>${e.tarih}</td>
            <td><strong>${e.eksikDk} dk</strong></td>
        </tr>`).join('');

        return `
            <div class="screen-content-wrapper">
                ${warningBanner()}
                <div class="mock-header">
                    <h3>Eksik Sürem</h3>
                    <span class="mock-header-badge">Son 30 Gün</span>
                </div>
                <div class="mock-stats">
                    <div class="mock-stat-card">
                        <div class="mock-stat-label">Toplam Eksik Süre</div>
                        <div class="mock-stat-value">${toplamDk} dk</div>
                        <div class="mock-stat-change down">Kümülatif</div>
                    </div>
                </div>
                <div class="mock-table-card">
                    <div class="mock-table-header">
                        <h4>Eksik Süre Kayıtları</h4>
                    </div>
                    <div class="table-scroll-wrapper">
                        <table class="mock-table">
                            <thead>
                                <tr>
                                    <th>Tarih</th>
                                    <th>Eksik Süre</th>
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                </div>
            </div>`;
    }

    function renderKaliteItiraz() {
        const shuffled = [...NAMES].sort(() => Math.random() - 0.5).slice(0, 10);
        let toplamOrtalama = 0;
        const temsilciRows = shuffled.map(name => {
            const ort = parseFloat(randFloat(55, 100));
            toplamOrtalama += ort;
            return `<tr>
                <td>${name}</td>
                <td>10</td>
                <td><strong>${ort.toFixed(2)}</strong></td>
            </tr>`;
        }).join('');
        const genelOrtalama = (toplamOrtalama / 10).toFixed(2);

        return `
            <div class="screen-content-wrapper">
                ${warningBanner()}
                <div class="mock-header">
                    <h3>Kalite</h3>
                    <button class="dream-btn dream-btn-primary" id="kaliteItirazBtn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                        İtiraz Et
                    </button>
                </div>
                <div class="dream-tabs" id="kaliteTabs">
                    <button class="dream-tab active" data-tab="kalite-detay">Kalite Detay</button>
                    <button class="dream-tab" data-tab="kalite-aylik">Aylık Ortalama</button>
                </div>
                <div class="dream-tab-content active" id="tab-kalite-detay">
                    <div class="fake-screen" style="min-height:400px;">
                        <div class="fake-screen-inner">
                            <div class="fake-screen-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                    <line x1="8" y1="21" x2="16" y2="21"/>
                                    <line x1="12" y1="17" x2="12" y2="21"/>
                                </svg>
                            </div>
                            <div class="fake-screen-text">Hayali Ekran</div>
                        </div>
                    </div>
                </div>
                <div class="dream-tab-content" id="tab-kalite-aylik">
                    <div class="mock-table-card">
                        <div class="mock-table-header">
                            <h4>Aylık Ortalama</h4>
                        </div>
                        <div class="table-scroll-wrapper">
                            <table class="mock-table">
                                <thead>
                                    <tr>
                                        <th>Temsilci</th>
                                        <th>Adet</th>
                                        <th>Ortalama</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${temsilciRows}
                                    <tr class="mock-table-summary-row">
                                        <td><strong>Genel</strong></td>
                                        <td><strong>100</strong></td>
                                        <td><strong>${genelOrtalama}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    function renderAlarmlar() {
        const KONULAR = ['Adres Sorunu', 'Toplama Sorunu', 'Teslimat Gecikmesi', 'Ürün Eksik', 'Hasar Talebi', 'İade Sorunu', 'Toplama Sorunu'];
        const ISLEM_DURUMLARI = ['Beklemede', 'İşleme Alındı', 'Araştırılıyor', 'Yanıt Bekleniyor'];
        const COZUM_DURUMLARI = ['Çözümlendi', 'Tamamlandı', 'Kapatıldı'];

        const alarmBekleyenRows = [];
        for (let i = 0; i < randInt(5, 12); i++) {
            alarmBekleyenRows.push(`<tr>
                <td>${randItem(NAMES)}</td>
                <td>${randDate(30)}</td>
                <td>${randItem(SELLERS)}</td>
                <td>${randItem(KONULAR)}</td>
                <td>BLD-${randInt(100000, 999999)}</td>
                <td>CNT-${randInt(100000, 999999)}</td>
                <td>${randItem(['Evet', 'Hayır'])}</td>
                <td>${randItem(ISLEM_DURUMLARI)}</td>
                <td><button class="tex-table-action-btn" disabled>İşlem</button></td>
            </tr>`);
        }

        const alarmCozumRows = [];
        for (let i = 0; i < randInt(3, 8); i++) {
            alarmCozumRows.push(`<tr>
                <td>${randItem(NAMES)}</td>
                <td>${randDate(60)}</td>
                <td>${randItem(SELLERS)}</td>
                <td>${randItem(KONULAR)}</td>
                <td>BLD-${randInt(100000, 999999)}</td>
                <td>CNT-${randInt(100000, 999999)}</td>
                <td>${randItem(['Evet', 'Hayır'])}</td>
                <td>${randItem(COZUM_DURUMLARI)}</td>
                <td><span class="tex-resolved-badge">Çözümlendi</span></td>
            </tr>`);
        }
        return `
            <div class="screen-content-wrapper">
                ${warningBanner()}
                <div class="tex-screen-header">
                    <div>
                        <h3 class="tex-screen-title">Alarmlar</h3>
                        <p class="tex-screen-subtitle">Alarm kayıtları ve durum takibi</p>
                    </div>
                    <button class="tex-action-btn tex-action-btn-disabled" disabled title="Bu buton pasif durumdadır">+ Alarm Oluştur</button>
                </div>
                <div class="tex-tabs" id="alarmlarTabs">
                    <button class="tex-tab active" data-tab="alarm-bekleyen">İşlem Bekleyenler</button>
                    <button class="tex-tab" data-tab="alarm-cozumleneler">Çözümlenenler</button>
                </div>
                <div class="dream-tab-content active" id="tab-alarm-bekleyen">
                    <div class="table-scroll-wrapper">
                        <table class="tex-table">
                            <thead>
                                <tr>
                                    <th>TEMSİLCİ</th>
                                    <th>TARİH</th>
                                    <th>SATICI ID</th>
                                    <th>KONU</th>
                                    <th>BİLDİRİM NO</th>
                                    <th>KONTAK ID</th>
                                    <th>ALARM ÜRETİLDİ Mİ?</th>
                                    <th>İŞLEM DURUMU</th>
                                    <th>İŞLEM</th>
                                </tr>
                            </thead>
                            <tbody>${alarmBekleyenRows}</tbody>
                        </table>
                    </div>
                </div>
                <div class="dream-tab-content" id="tab-alarm-cozumleneler">
                    <div class="table-scroll-wrapper">
                        <table class="tex-table">
                            <thead>
                                <tr>
                                    <th>TEMSİLCİ</th>
                                    <th>TARİH</th>
                                    <th>SATICI ID</th>
                                    <th>KONU</th>
                                    <th>BİLDİRİM NO</th>
                                    <th>KONTAK ID</th>
                                    <th>ALARM ÜRETİLDİ Mİ?</th>
                                    <th>İŞLEM DURUMU</th>
                                    <th>İŞLEM</th>
                                </tr>
                            </thead>
                            <tbody>${alarmCozumRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>`;
    }

    function renderKronikSeller() {
        const KONULAR_KS = ['Hasar', 'Kayıp Gönderi', 'Yanlış Ürün', 'Eksik Ürün'];
        const KAPANIS = ['Açık', 'Kapalı', 'Beklemede'];

        const ksBekleyenRows = [];
        for (let i = 0; i < randInt(5, 12); i++) {
            ksBekleyenRows.push(`<tr>
                <td>${randItem(NAMES)}</td>
                <td>${randDate(30)}</td>
                <td>${randItem(SELLERS)}</td>
                <td>${randItem(KONULAR_KS)}</td>
                <td>BLD-${randInt(100000, 999999)}</td>
                <td>CNT-${randInt(100000, 999999)}</td>
                <td>${randItem(KAPANIS)}</td>
                <td>CNT-${randInt(100000, 999999)}</td>
                <td><button class="tex-table-action-btn" disabled>İşlem</button></td>
            </tr>`);
        }

        const ksCozumRows = [];
        for (let i = 0; i < randInt(3, 8); i++) {
            ksCozumRows.push(`<tr>
                <td>${randItem(NAMES)}</td>
                <td>${randDate(60)}</td>
                <td>${randItem(SELLERS)}</td>
                <td>${randItem(KONULAR_KS)}</td>
                <td>BLD-${randInt(100000, 999999)}</td>
                <td>CNT-${randInt(100000, 999999)}</td>
                <td>Kapalı</td>
                <td>CNT-${randInt(100000, 999999)}</td>
                <td><span class="tex-resolved-badge">Çözümlendi</span></td>
            </tr>`);
        }

        return `
            <div class="screen-content-wrapper">
                ${warningBanner()}
                <div class="tex-screen-header">
                    <div>
                        <h3 class="tex-screen-title">Tazmin Kronik Seller</h3>
                        <p class="tex-screen-subtitle">Kronik seller kayıtları ve takibi</p>
                    </div>
                    <button class="tex-action-btn tex-action-btn-disabled" disabled title="Bu buton pasif durumdadır">+ Kronik Seller Ekle</button>
                </div>
                <div class="tex-tabs" id="kronikTabs">
                    <button class="tex-tab active" data-tab="kronik-bekleyen">İşlem Bekleyenler</button>
                    <button class="tex-tab" data-tab="kronik-cozumleneler">Çözümlenenler</button>
                </div>
                <div class="dream-tab-content active" id="tab-kronik-bekleyen">
                    <div class="table-scroll-wrapper">
                        <table class="tex-table">
                            <thead>
                                <tr>
                                    <th>TEMSİLCİ</th>
                                    <th>TARİH</th>
                                    <th>SATICI ID</th>
                                    <th>KONU</th>
                                    <th>AÇILAN BİLDİRİM NO</th>
                                    <th>KONTAK ID</th>
                                    <th>KAPANIŞ DURUMU</th>
                                    <th>GERİ ARAMA KONTAK ID</th>
                                    <th>İŞLEM</th>
                                </tr>
                            </thead>
                            <tbody>${ksBekleyenRows.join('')}</tbody>
                        </table>
                    </div>
                </div>
                <div class="dream-tab-content" id="tab-kronik-cozumleneler">
                    <div class="table-scroll-wrapper">
                        <table class="tex-table">
                            <thead>
                                <tr>
                                    <th>TEMSİLCİ</th>
                                    <th>TARİH</th>
                                    <th>SATICI ID</th>
                                    <th>KONU</th>
                                    <th>AÇILAN BİLDİRİM NO</th>
                                    <th>KONTAK ID</th>
                                    <th>KAPANIŞ DURUMU</th>
                                    <th>GERİ ARAMA KONTAK ID</th>
                                    <th>İŞLEM</th>
                                </tr>
                            </thead>
                            <tbody>${ksCozumRows.join('')}</tbody>
                        </table>
                    </div>
                </div>
            </div>`;
    }

    const XDOCK_ENTRIES = [];
    for (let i = 0; i < 40; i++) {
        XDOCK_ENTRIES.push({ branch_name: randItem(BRANCHES) + ' ' + randItem(['Şube', 'Depo', 'Hub', 'Transfer', 'Merkez']), xdock_id: randItem(XDOCK_IDS) });
    }

    function renderTdesk() {
        return `
            <div class="tdesk-screen-wrapper">
                <!-- Toolbar (like Tex All-In popup-wrapper toolbar) -->
                <div class="tdesk-toolbar" id="tdeskToolbar">
                    <button class="tdesk-toolbar-btn" id="tdeskHizliMetinBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        Script
                    </button>
                    <div class="tdesk-dropdown" id="tdeskDropdown">
                        <div class="tdesk-dropdown-item" data-metin="Selamlar,\n\nBu bir talep metnidir.\n\nİyi çalışmalar.">
                            Script
                        </div>
                    </div>

                    <div class="tdesk-talep-basligi-container">
                        <select class="tdesk-talep-basligi-select" id="tdeskTalepBasligiSelect">
                            <option value="">Talep Başlığı Seç...</option>
                            <option value="DEF">X Talebi</option>
                        </select>
                        <span class="tdesk-talep-basligi-text" id="tdeskTalepBasligiText" title="Kopyalamak için tıkla"></span>
                    </div>

                    <span class="tdesk-toolbar-title">Tdesk Hayali Ekran</span>

                    <div class="tdesk-xdock-search tdesk-ka-search" id="tdeskKaSearch">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <input type="text" id="tdeskKaInput" placeholder="KA Sorgula" autocomplete="off" inputmode="numeric">
                        <div class="tdesk-xdock-results" id="tdeskKaResults"></div>
                    </div>

                    <div class="tdesk-xdock-search" id="tdeskXdockSearch">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <input type="text" id="tdeskXdockInput" placeholder="Şube veya XDOCK..." autocomplete="off">
                        <div class="tdesk-xdock-results" id="tdeskXdockResults"></div>
                    </div>
                </div>

                <!-- Main content area (Hayali Ekran fills rest) -->
                <div class="tdesk-main-area">
                    <div class="fake-screen">
                        <div class="fake-screen-inner">
                            <div class="fake-screen-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                    <line x1="8" y1="21" x2="16" y2="21"/>
                                    <line x1="12" y1="17" x2="12" y2="21"/>
                                </svg>
                            </div>
                            <div class="fake-screen-text">Hayali Ekran</div>
                        </div>
                    </div>
                </div>

                <!-- Toast notification -->
                <div class="tdesk-toast" id="tdeskToast">Metin kopyalandı!</div>
            </div>`;
    }

    function renderForm() {
        return `
            <div class="screen-content-wrapper">
                ${warningBanner()}
                <div class="mock-header">
                    <h3>Form</h3>
                </div>
                <div class="dream-tabs" id="formTabs">
                    <button class="dream-tab active" data-tab="form-ilet">Form İlet</button>
                    <button class="dream-tab" data-tab="iletilen-formlar">İletilen Formlar</button>
                </div>
                <div class="dream-tab-content active" id="tab-form-ilet">
                    <div class="form-ilet-card">
                        <div class="form-ilet-grid">
                            <div class="form-group">
                                <label>Satıcı</label>
                                <input type="text" class="dream-input" placeholder="Satıcı">
                            </div>
                            <div class="form-group">
                                <label>Hatalı Gönderi Kodu</label>
                                <input type="text" class="dream-input" placeholder="Hatalı Gönderi Kodu">
                            </div>
                            <div class="form-group">
                                <label>En</label>
                                <input type="text" class="dream-input" placeholder="En">
                            </div>
                            <div class="form-group">
                                <label>Boy</label>
                                <input type="text" class="dream-input" placeholder="Boy">
                            </div>
                            <div class="form-group">
                                <label>Yükseklik</label>
                                <input type="text" class="dream-input" placeholder="Yükseklik">
                            </div>
                            <div class="form-group">
                                <label>Hatalı Gönderi Kodu 2</label>
                                <input type="text" class="dream-input" placeholder="Hatalı Gönderi Kodu 2">
                            </div>
                            <div class="form-group">
                                <label>En</label>
                                <input type="text" class="dream-input" placeholder="En">
                            </div>
                            <div class="form-group">
                                <label>Boy</label>
                                <input type="text" class="dream-input" placeholder="Boy">
                            </div>
                            <div class="form-group">
                                <label>Yükseklik</label>
                                <input type="text" class="dream-input" placeholder="Yükseklik">
                            </div>
                            <div class="form-group form-group-full">
                                <label>Sorun Detayı</label>
                                <textarea class="dream-textarea" placeholder="Sorun Detayı" rows="4"></textarea>
                            </div>
                        </div>
                        <div class="form-ilet-footer">
                            <button class="form-ilet-btn" disabled title="Bu buton pasif durumdadır">İlet</button>
                        </div>
                    </div>
                </div>
                <div class="dream-tab-content" id="tab-iletilen-formlar">
                    <div class="fake-screen" style="min-height:400px;">
                        <div class="fake-screen-inner">
                            <div class="fake-screen-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                    <line x1="8" y1="21" x2="16" y2="21"/>
                                    <line x1="12" y1="17" x2="12" y2="21"/>
                                </svg>
                            </div>
                            <div class="fake-screen-text">Hayali Ekran</div>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    function renderHinterlandCheck() {
        return `
            <div class="screen-content-wrapper tex-dark-bg">
                <div class="tex-screen-header">
                    <div>
                        <h3 class="tex-screen-title">LM Toplama Hinterland Check</h3>
                        <p class="tex-screen-subtitle">İl, İlçe ve Mahalle bilgisi girerek Şube ve XDOCK ID bilgisini sorgulayın</p>
                    </div>
                </div>
                
                <div class="tex-form-row">
                    <div class="tex-form-group">
                        <label>İl</label>
                        <select class="tex-select">
                            <option value="izmir">İZMİR</option>
                        </select>
                    </div>
                    <div class="tex-form-group">
                        <label>İlçe</label>
                        <select class="tex-select">
                            <option value="buca">BUCA</option>
                        </select>
                    </div>
                    <div class="tex-form-group">
                        <label>Mahalle</label>
                        <select class="tex-select">
                            <option value="aydogdu">AYDOĞDU</option>
                        </select>
                    </div>
                </div>
                
                <button class="tex-form-submit-btn" id="hinterlandQueryBtn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Sorgula
                </button>
                
                <div class="tex-result-container hidden" id="hinterlandResult">
                    <div class="tex-result-header">
                        <div class="tex-result-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span>Sonuç Bulundu</span>
                    </div>
                    <div class="tex-result-cards">
                        <div class="tex-result-card">
                            <div class="tex-card-label">ŞUBE</div>
                            <div class="tex-card-value" id="hinterlandSubeValue">-</div>
                        </div>
                        <div class="tex-result-card">
                            <div class="tex-card-label">XDOCK ID</div>
                            <div class="tex-card-value orange" id="hinterlandXdockValue">-</div>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    function getScreenHTML(screenId) {
        switch (screenId) {
            case 'eksik-surem': return renderEksikSurem();
            case 'kalite-itiraz': return renderKaliteItiraz();
            case 'alarmlar': return renderAlarmlar();
            case 'kronik-seller': return renderKronikSeller();
            case 'tdesk': return renderTdesk();
            case 'form': return renderForm();
            case 'hinterland': return renderHinterlandCheck();
            default: return renderFakeScreen();
        }
    }

    function showScreen(screenId) {
        const data = screenData[screenId];
        if (!data) return;

        activeScreen = screenId;

        $$('.nav-link').forEach(el => el.classList.remove('active'));
        const navLink = $(`.nav-link[data-screen="${screenId}"]`);
        if (navLink) navLink.classList.add('active');

        $('#topbarScreenName').textContent = data.title;
        $('#topbarIcon').textContent = data.icon;

        const container = $('#screenContainer');
        const welcome = $('#welcomeScreen');
        if (welcome) welcome.style.display = 'none';

        const existing = container.querySelector('.screen-panel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.className = 'screen-panel active';
        panel.innerHTML = getScreenHTML(screenId);
        container.appendChild(panel);

        initScreenBehaviors(screenId, panel);

        $('#sidebar').classList.remove('open');
    }

    function initScreenBehaviors(screenId, panel) {
        const tabContainers = panel.querySelectorAll('.dream-tabs, .tex-tabs');
        tabContainers.forEach(tabContainer => {
            const tabs = tabContainer.querySelectorAll('.dream-tab, .tex-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabId = tab.dataset.tab;
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    const allContents = panel.querySelectorAll('.dream-tab-content');
                    allContents.forEach(c => c.classList.remove('active'));
                    const target = panel.querySelector(`#tab-${tabId}`);
                    if (target) target.classList.add('active');
                });
            });
        });

        if (screenId === 'kalite-itiraz') {
            const itirazBtn = panel.querySelector('#kaliteItirazBtn');
            if (itirazBtn) {
                itirazBtn.addEventListener('click', () => {
                    const modal = $('#kaliteItirazModal');
                    if (modal) modal.style.display = 'flex';
                });
            }
        }

        if (screenId === 'tdesk') {
            const toolbar = panel.querySelector('#tdeskToolbar');
            const hizliBtn = panel.querySelector('#tdeskHizliMetinBtn');
            const dropdown = panel.querySelector('#tdeskDropdown');
            const xdockInput = panel.querySelector('#tdeskXdockInput');
            const xdockResults = panel.querySelector('#tdeskXdockResults');
            const toast = panel.querySelector('#tdeskToast');
            const talepSelect = panel.querySelector('#tdeskTalepBasligiSelect');
            const talepText = panel.querySelector('#tdeskTalepBasligiText');

            function showToast() {
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2000);
            }

            function copyText(text) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast();
                }).catch(() => {
                    const ta = document.createElement('textarea');
                    ta.value = text;
                    ta.style.position = 'fixed';
                    ta.style.left = '-9999px';
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    ta.remove();
                    showToast();
                });
            }

            let dropdownOpen = false;
            hizliBtn.addEventListener('click', () => {
                dropdownOpen = !dropdownOpen;
                dropdown.classList.toggle('active', dropdownOpen);
            });

            dropdown.querySelectorAll('.tdesk-dropdown-item').forEach(item => {
                item.addEventListener('click', () => {
                    const metin = item.dataset.metin.replace(/\\n/g, '\n');
                    copyText(metin);
                    dropdown.classList.remove('active');
                    dropdownOpen = false;
                });
            });

            document.addEventListener('mousedown', function tdeskOutsideClick(e) {
                if (!e.target.closest('#tdeskDropdown') && !e.target.closest('#tdeskHizliMetinBtn')) {
                    dropdown.classList.remove('active');
                    dropdownOpen = false;
                }
                if (!e.target.closest('#tdeskXdockSearch')) {
                    xdockResults.classList.remove('active');
                }
            });

            xdockInput.addEventListener('input', () => {
                const term = xdockInput.value.toLowerCase().trim();
                if (!term) {
                    xdockResults.classList.remove('active');
                    return;
                }

                const uniqueMatches = [];
                const seenNames = new Set();
                for (const entry of XDOCK_ENTRIES) {
                    const name = entry.branch_name.toLowerCase();
                    const id = entry.xdock_id.toLowerCase();
                    if ((name.includes(term) || id.includes(term)) && !seenNames.has(name)) {
                        uniqueMatches.push(entry);
                        seenNames.add(name);
                        if (uniqueMatches.length >= 10) break;
                    }
                }

                if (uniqueMatches.length > 0) {
                    xdockResults.innerHTML = uniqueMatches.map(m => `
                        <div class="tdesk-xdock-result-item" data-id="${m.xdock_id}">
                            <span class="tdesk-xdock-result-id">${m.xdock_id}</span>
                            <span class="tdesk-xdock-result-name">${m.branch_name}</span>
                        </div>
                    `).join('');
                    xdockResults.classList.add('active');

                    xdockResults.querySelectorAll('.tdesk-xdock-result-item').forEach(item => {
                        item.addEventListener('click', () => {
                            copyText(item.dataset.id);
                            xdockInput.value = '';
                            xdockResults.classList.remove('active');
                        });
                    });
                } else {
                    xdockResults.innerHTML = '<div style="padding:12px; font-size:11px; color:var(--text-dim); text-align:center;">Sonuç bulunamadı</div>';
                    xdockResults.classList.add('active');
                }
            });

            xdockInput.addEventListener('focus', () => {
                panel.querySelector('#tdeskXdockSearch').classList.add('focused');
            });
            xdockInput.addEventListener('blur', () => {
                panel.querySelector('#tdeskXdockSearch').classList.remove('focused');
            });

            const kaInput = panel.querySelector('#tdeskKaInput');
            const kaResults = panel.querySelector('#tdeskKaResults');
            if (kaInput && kaResults) {
                kaInput.addEventListener('input', () => {
                    kaInput.value = kaInput.value.replace(/[^0-9]/g, '');
                    const term = kaInput.value.trim();
                    if (!term) {
                        kaResults.classList.remove('active');
                        return;
                    }
                    if (term === '123') {
                        kaResults.innerHTML = `
                            <div class="tdesk-xdock-result-item" data-ka="123">
                                <span class="tdesk-xdock-result-id">123</span>
                                <span class="tdesk-xdock-result-name">Büyük Satıcı</span>
                            </div>`;
                        kaResults.classList.add('active');
                        kaResults.querySelector('.tdesk-xdock-result-item').addEventListener('click', () => {
                            copyText('Büyük Satıcı');
                            kaInput.value = '';
                            kaResults.classList.remove('active');
                        });
                    } else {
                        kaResults.innerHTML = '<div style="padding:12px; font-size:11px; color:var(--text-dim); text-align:center;">Sonuç bulunamadı</div>';
                        kaResults.classList.add('active');
                    }
                });
                document.addEventListener('mousedown', function kaOutsideClick(e) {
                    if (!e.target.closest('#tdeskKaSearch')) {
                        kaResults.classList.remove('active');
                    }
                });
            }

            if (talepSelect && talepText) {
                talepSelect.addEventListener('change', () => {
                    const val = talepSelect.value;
                    if (val) {
                        talepText.textContent = val;
                        talepText.classList.add('active');
                    } else {
                        talepText.textContent = '';
                        talepText.classList.remove('active');
                    }
                });
                talepText.addEventListener('click', () => {
                    if (talepText.textContent) copyText(talepText.textContent);
                });
            }
        }

        if (screenId === 'hinterland') {
            const queryBtn = panel.querySelector('#hinterlandQueryBtn');
            const resultBox = panel.querySelector('#hinterlandResult');
            const subeVal = panel.querySelector('#hinterlandSubeValue');
            const xdockVal = panel.querySelector('#hinterlandXdockValue');

            if (queryBtn) {
                queryBtn.addEventListener('click', () => {
                    resultBox.classList.remove('hidden');
                    const izmirSubeler = ['İzmir Buca Şube'];
                    subeVal.textContent = randItem(izmirSubeler);
                    xdockVal.textContent = randItem(['XDOCK-001']); // Izmir realistic XDOCKs
                });
            }
        }
    }

    $$('.nav-link[data-screen]').forEach(link => {
        link.addEventListener('click', (e) => {
            showScreen(link.dataset.screen);
        });
    });

    $$('.nav-folder-title').forEach(title => {
        title.addEventListener('click', () => {
            const folderId = title.dataset.folder;
            const list = document.querySelector(`.nav-sublist[data-folder-list="${folderId}"]`);
            if (!list) return;
            title.classList.toggle('collapsed');
            list.style.display = title.classList.contains('collapsed') ? 'none' : '';
        });
    });

    $$('.nav-section-title[data-collapsible]').forEach(title => {
        title.addEventListener('click', () => {
            title.classList.toggle('collapsed');
            const list = title.nextElementSibling;
            if (list) {
                list.style.display = title.classList.contains('collapsed') ? 'none' : '';
            }
        });
    });

    const searchInput = $('#screenSearch');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        $$('.nav-item').forEach(item => {
            const text = item.querySelector('.nav-link-text')?.textContent.toLowerCase() || '';
            if (item.classList.contains('nav-folder')) {
                const subItems = item.querySelectorAll('.nav-sublist .nav-item');
                let anyMatch = false;
                subItems.forEach(si => {
                    const t = si.querySelector('.nav-link-text')?.textContent.toLowerCase() || '';
                    const match = t.includes(query);
                    si.style.display = match ? '' : 'none';
                    if (match) anyMatch = true;
                });
                item.style.display = (anyMatch || text.includes(query) || !query) ? '' : 'none';
            } else {
                item.style.display = text.includes(query) ? '' : 'none';
            }
        });
        if (query) {
            $$('.nav-section-title[data-collapsible]').forEach(t => {
                t.classList.remove('collapsed');
                const list = t.nextElementSibling;
                if (list) list.style.display = '';
            });
            $$('.nav-folder-title').forEach(t => {
                t.classList.remove('collapsed');
                const folderId = t.dataset.folder;
                const list = document.querySelector(`.nav-sublist[data-folder-list="${folderId}"]`);
                if (list) list.style.display = '';
            });
        }
    });

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    });

    $('#sidebarToggle').addEventListener('click', () => {
        $('#sidebar').classList.toggle('collapsed');
    });

    $('#mobileMenuBtn').addEventListener('click', () => {
        $('#sidebar').classList.toggle('open');
    });

    const themeBtn = $('#themeToggleBtn');
    let isLight = localStorage.getItem('dream-theme') === 'light';
    if (isLight) {
        document.body.classList.add('light-mode');
        $('#themeIconSun').style.display = 'none';
        $('#themeIconMoon').style.display = '';
    }
    themeBtn.addEventListener('click', () => {
        isLight = !isLight;
        document.body.classList.toggle('light-mode', isLight);
        $('#themeIconSun').style.display = isLight ? 'none' : '';
        $('#themeIconMoon').style.display = isLight ? '' : 'none';
        localStorage.setItem('dream-theme', isLight ? 'light' : 'dark');
    });

    const announcementBell = $('#announcementBell');
    const announcementModal = $('#announcementModal');
    const closeAnnouncementModal = $('#closeAnnouncementModal');

    announcementBell.addEventListener('click', () => {
        announcementModal.style.display = 'flex';
    });
    closeAnnouncementModal.addEventListener('click', () => {
        announcementModal.style.display = 'none';
    });
    announcementModal.addEventListener('click', (e) => {
        if (e.target === announcementModal) announcementModal.style.display = 'none';
    });

    $('#taleplerBtn').addEventListener('click', () => {
    });
    $('#egitimBtn').addEventListener('click', () => {
    });

    const dispoKitapcikBtn = $('#dispoKitapcikBtn');
    const dispoKitapcikModal = $('#dispoKitapcikModal');
    const closeDispoKitapcikModal = $('#closeDispoKitapcikModal');
    if (dispoKitapcikBtn && dispoKitapcikModal) {
        dispoKitapcikBtn.addEventListener('click', () => {
            dispoKitapcikModal.style.display = 'flex';
        });
        closeDispoKitapcikModal.addEventListener('click', () => {
            dispoKitapcikModal.style.display = 'none';
        });
        dispoKitapcikModal.addEventListener('click', (e) => {
            if (e.target === dispoKitapcikModal) dispoKitapcikModal.style.display = 'none';
        });
        dispoKitapcikModal.querySelectorAll('.dispo-accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('open');
            });
        });
    }

    const kaliteItirazModal = $('#kaliteItirazModal');
    const closeKaliteItirazModal = $('#closeKaliteItirazModal');
    const cancelKaliteItiraz = $('#cancelKaliteItiraz');
    const submitKaliteItiraz = $('#submitKaliteItiraz');

    function closeKIModal() {
        kaliteItirazModal.style.display = 'none';
        ['kiTamIsim', 'kiKontakId', 'kiPuan', 'kiItirazSebebi'].forEach(id => {
            const el = $(`#${id}`);
            if (el) el.value = '';
        });
        const select = $('#kiDegerlendiren');
        if (select) select.selectedIndex = 0;
        const warning = $('#kiWarning');
        if (warning) warning.style.display = 'none';
    }

    if (closeKaliteItirazModal) closeKaliteItirazModal.addEventListener('click', closeKIModal);
    if (cancelKaliteItiraz) cancelKaliteItiraz.addEventListener('click', closeKIModal);
    if (kaliteItirazModal) {
        kaliteItirazModal.addEventListener('click', (e) => {
            if (e.target === kaliteItirazModal) closeKIModal();
        });
    }
    if (submitKaliteItiraz) {
        submitKaliteItiraz.addEventListener('click', () => {
            const fields = ['kiTamIsim', 'kiKontakId', 'kiPuan', 'kiItirazSebebi'];
            const warning = $('#kiWarning');
            let valid = true;
            fields.forEach(id => {
                if (!$(`#${id}`).value.trim()) valid = false;
            });
            if (!$('#kiDegerlendiren').value) valid = false;

            if (!valid) {
                if (warning) warning.style.display = 'block';
                return;
            }
            if (warning) warning.style.display = 'none';
            closeKIModal();
        });
    }

})();
