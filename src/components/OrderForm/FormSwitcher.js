export function switchForm() {
    const generalBlocks = document.querySelectorAll('.generalBlock');
    generalBlocks.forEach(function (generalBlock) {
        generalBlock.addEventListener('click', function (event) {
            if (event.target.classList.contains('tab')) {
                const tabs = generalBlock.querySelectorAll('.tab');
                tabs.forEach(function (tab) {
                    tab.classList.remove('active');
                });
                event.target.classList.add('active');
                const tabForms = generalBlock.querySelectorAll('.tab-form');
                tabForms.forEach(function (tabForm, index) {
                    tabForm.classList.toggle('active', index === Array.from(tabs).indexOf(event.target));
                });
            }
        });
    });
}