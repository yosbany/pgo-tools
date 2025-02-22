import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

type IVAType = '0' | '10' | '22' | 'none';

interface CalculationResult {
  unitCost: number;
  profit: number;
  sellingPrice: number;
  sellingPriceWithIVA: number;
  ivaAmount: number;
}

const MarkupCalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [margin, setMargin] = useState<string>('');
  const [selectedIVA, setSelectedIVA] = useState<IVAType>('none');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const formatNumber = (value: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');
    // Limit to 2 decimal places
    if (parts[1]?.length > 2) return parts[0] + '.' + parts[1].slice(0, 2);
    return cleaned;
  };

  const calculatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountNumber = parseFloat(amount);
    const quantityNumber = parseInt(quantity);
    const marginNumber = parseFloat(margin);

    if (amountNumber <= 0) {
      setError('El importe debe ser mayor que 0');
      return;
    }

    if (quantityNumber <= 0) {
      setError('La cantidad debe ser mayor que 0');
      return;
    }

    if (marginNumber <= 0) {
      setError('El margen debe ser mayor que 0');
      return;
    }

    if (marginNumber >= 100 || marginNumber <= 0) {
      setError('El margen debe estar entre 0% y 100% (exclusivo)');
      return;
    }

    try {
      const marginDecimal = marginNumber / 100;
      const unitCost = amountNumber / quantityNumber;
      const sellingPrice = unitCost / (1 - marginDecimal);
      const ivaRate = selectedIVA === 'none' ? 0 : Number(selectedIVA) / 100;
      const ivaAmount = sellingPrice * ivaRate;
      const sellingPriceWithIVA = sellingPrice + ivaAmount;
      const profit = sellingPrice - unitCost;

      setResult({
        unitCost: Math.round(unitCost),
        profit: Math.round(profit),
        sellingPrice: Math.round(sellingPrice),
        sellingPriceWithIVA: Math.round(sellingPriceWithIVA),
        ivaAmount: Math.round(ivaAmount)
      });
    } catch (err) {
      setError('Error en el cálculo. Por favor, verifica los valores ingresados.');
      setResult(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-90">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Calculadora de Precios</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={calculatePrice} className="space-y-6">
        {/* Importe */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="amount" className="block text-base font-semibold text-gray-700">
              Importe
            </label>
            <div className="group relative">
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute right-0 w-48 p-2 mt-2 text-xs bg-gray-800 text-white rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                Ingresa el importe total de la compra
              </div>
            </div>
          </div>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(formatNumber(e.target.value))}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 text-lg py-3 border-gray-300 rounded-lg transition-shadow duration-200 hover:shadow-sm"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        {/* Cantidad */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="quantity" className="block text-base font-semibold text-gray-700">
              Cantidad
            </label>
            <div className="group relative">
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute right-0 w-48 p-2 mt-2 text-xs bg-gray-800 text-white rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                Número de unidades
              </div>
            </div>
          </div>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="quantity"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 text-lg py-3 border-gray-300 rounded-lg transition-shadow duration-200 hover:shadow-sm"
              placeholder="1"
              required
            />
          </div>
        </div>

        {/* IVA Selector */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-base font-semibold text-gray-700">
              IVA Aplicable
            </label>
            <div className="group relative">
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute right-0 w-48 p-2 mt-2 text-xs bg-gray-800 text-white rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                Selecciona el tipo de IVA a aplicar al precio final
              </div>
            </div>
          </div>
          <select
            value={selectedIVA}
            onChange={(e) => setSelectedIVA(e.target.value as IVAType)}
            className="mt-1 block w-full pl-4 pr-10 py-3 text-lg border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-shadow duration-200 hover:shadow-sm"
          >
            <option value="none">Sin IVA</option>
            <option value="0">Exento 0%</option>
            <option value="10">Mínimo 10%</option>
            <option value="22">Básico 22%</option>
          </select>
        </div>

        {/* Margen */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="margin" className="block text-base font-semibold text-gray-700">
              Porcentaje de Margen
            </label>
            <div className="group relative">
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute right-0 w-48 p-2 mt-2 text-xs bg-gray-800 text-white rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                Margen deseado (0-100% exclusivo). Fórmula: Precio Venta = Costo Unitario / (1 - Margen)
              </div>
            </div>
          </div>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="margin"
              id="margin"
              step="0.1"
              min="0"
              max="99.9"
              value={margin}
              onChange={(e) => setMargin(formatNumber(e.target.value))}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 text-lg py-3 border-gray-300 rounded-lg transition-shadow duration-200 hover:shadow-sm"
              placeholder="0"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">%</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
        >
          Calcular
        </button>
      </form>

      {result && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resultados:</h3>
          <div className="bg-gradient-to-br from-indigo-50 to-gray-50 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-indigo-600 font-medium">Costo Unitario</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${result.unitCost.toLocaleString('es-ES')}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-indigo-600 font-medium">Ganancia</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${result.profit.toLocaleString('es-ES')}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-indigo-600 font-medium">Precio de Venta</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${result.sellingPrice.toLocaleString('es-ES')}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-indigo-600 font-medium">IVA ({selectedIVA === 'none' ? '0' : selectedIVA}%)</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${result.ivaAmount.toLocaleString('es-ES')}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-indigo-600 font-medium">Precio Final con IVA</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${result.sellingPriceWithIVA.toLocaleString('es-ES')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkupCalculator;