const { useState, useMemo } = React;

const INITIAL_FORM_DATA = {
  control: {
    impressions: '',
    clicks: '',
    conversions: '',
  },
  test: {
    impressions: '',
    clicks: '',
    conversions: '',
  },
  metric: 'ctr',
  confidence: '0.95',
};

const INITIAL_SUMMARY = {
  control: '—',
  test: '—',
  difference: '—',
};

const INITIAL_CALC_DETAILS = {
  standardError: '—',
  zScore: '—',
  pValue: '—',
};

const metricOptions = [
  { value: 'ctr', label: 'CTR (клики / показы)' },
  { value: 'cvr', label: 'CR (конверсии / клики)' },
  { value: 'cr-impressions', label: 'CR (конверсии / показы)' },
];

const confidenceOptions = [
  { value: '0.90', label: '90%' },
  { value: '0.95', label: '95%' },
  { value: '0.99', label: '99%' },
];

function NumberField({ id, label, name, value, placeholder, onChange }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        id={id}
        name={name}
        type="number"
        min="0"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </label>
  );
}

function SelectField({ id, label, name, value, options, onChange }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <select id={id} name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Section({ title, children, id }) {
  return (
    <section id={id} className="section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function App() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [statusMessage, setStatusMessage] = useState(
    'Введите данные, чтобы получить результат.'
  );
  const [metricsSummary, setMetricsSummary] = useState(INITIAL_SUMMARY);
  const [calculationDetails, setCalculationDetails] = useState(
    INITIAL_CALC_DETAILS
  );

  const handleNumberChange = (event) => {
    const { name, value } = event.target;
    const [group, field] = name.split('.');

    setFormData((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value,
      },
    }));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatusMessage('Расчёт пока не реализован. Добавьте бизнес-логику.');
    setMetricsSummary(INITIAL_SUMMARY);
    setCalculationDetails(INITIAL_CALC_DETAILS);
  };

  const handleReset = (event) => {
    event.preventDefault();
    setFormData(INITIAL_FORM_DATA);
    setStatusMessage('Введите данные, чтобы получить результат.');
    setMetricsSummary(INITIAL_SUMMARY);
    setCalculationDetails(INITIAL_CALC_DETAILS);
  };

  const formFields = useMemo(
    () => [
      {
        legend: 'Контрольная группа',
        group: 'control',
        fields: [
          {
            id: 'control-impressions',
            name: 'control.impressions',
            label: 'Показы',
            placeholder: 'Например, 12000',
          },
          {
            id: 'control-clicks',
            name: 'control.clicks',
            label: 'Клики',
            placeholder: 'Например, 340',
          },
          {
            id: 'control-conversions',
            name: 'control.conversions',
            label: 'Конверсии',
            placeholder: 'Например, 45',
          },
        ],
      },
      {
        legend: 'Тестовая группа',
        group: 'test',
        fields: [
          {
            id: 'test-impressions',
            name: 'test.impressions',
            label: 'Показы',
            placeholder: 'Например, 11800',
          },
          {
            id: 'test-clicks',
            name: 'test.clicks',
            label: 'Клики',
            placeholder: 'Например, 370',
          },
          {
            id: 'test-conversions',
            name: 'test.conversions',
            label: 'Конверсии',
            placeholder: 'Например, 52',
          },
        ],
      },
    ],
    []
  );

  return (
    <div className="app">
      <header className="app__header">
        <h1>Калькулятор проверки статистической значимости</h1>
        <p>
          Сравните результаты контрольной и тестовой рекламных кампаний, чтобы
          понять, есть ли значимое отличие.
        </p>
      </header>

      <main className="app__main">
        <Section id="input-section" title="Входные данные">
          <form className="form" onSubmit={handleSubmit} onReset={handleReset}>
            {formFields.map(({ legend, fields, group }) => (
              <fieldset key={group} className="form__fieldset">
                <legend>{legend}</legend>
                {fields.map(({ id, name, label, placeholder }) => (
                  <NumberField
                    key={id}
                    id={id}
                    label={label}
                    name={name}
                    placeholder={placeholder}
                    value={formData[group][name.split('.')[1]]}
                    onChange={handleNumberChange}
                  />
                ))}
              </fieldset>
            ))}

            <fieldset className="form__fieldset">
              <legend>Настройки расчёта</legend>
              <SelectField
                id="metric"
                name="metric"
                label="Ключевая метрика"
                value={formData.metric}
                options={metricOptions}
                onChange={handleSelectChange}
              />
              <SelectField
                id="confidence"
                name="confidence"
                label="Уровень значимости"
                value={formData.confidence}
                options={confidenceOptions}
                onChange={handleSelectChange}
              />
            </fieldset>

            <div className="form__actions">
              <button type="submit">Рассчитать</button>
              <button type="reset">Сбросить</button>
            </div>
          </form>
        </Section>

        <Section id="results-section" title="Результаты">
          <div className="results-grid">
            <article className="result-card">
              <h3>Показатели</h3>
              <ul className="metrics-summary">
                <li>
                  CTR контрольной группы: <span className="value">{metricsSummary.control}</span>
                </li>
                <li>
                  CTR тестовой группы: <span className="value">{metricsSummary.test}</span>
                </li>
                <li>
                  Разница: <span className="value">{metricsSummary.difference}</span>
                </li>
              </ul>
            </article>

            <article className="result-card">
              <h3>Статистический вывод</h3>
              <p>{statusMessage}</p>
            </article>

            <article className="result-card">
              <h3>Детали расчёта</h3>
              <dl className="calculation-details">
                <dt>Стандартная ошибка</dt>
                <dd>{calculationDetails.standardError}</dd>
                <dt>Z-значение</dt>
                <dd>{calculationDetails.zScore}</dd>
                <dt>p-значение</dt>
                <dd>{calculationDetails.pValue}</dd>
              </dl>
            </article>
          </div>
        </Section>

        <Section id="notes-section" title="Как интерпретировать результаты">
          <ol className="notes-list">
            <li>Проверьте выбранный уровень значимости и метрику.</li>
            <li>Сравните рассчитанные показатели для контрольной и тестовой групп.</li>
            <li>
              Оцените p-значение: если оно меньше выбранного уровня значимости,
              различия значимы.
            </li>
            <li>
              В случае сомнений соберите больше данных для повышения точности.
            </li>
          </ol>
        </Section>
      </main>

      <footer className="app__footer">
        <p>© 2024 Инструменты анализа рекламных кампаний</p>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
