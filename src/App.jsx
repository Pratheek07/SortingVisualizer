import React, { useState, useEffect } from 'react';
import './App.css';

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [ascending, setAscending] = useState(true);
  const [algorithm, setAlgorithm] = useState('Bubble Sort');
  const [currentStep, setCurrentStep] = useState(0);
  const [sortingInterval, setSortingInterval] = useState(null);
  const [sortingSpeed, setSortingSpeed] = useState(100); // Milliseconds delay between iterations

  useEffect(() => {
    resetArray();
  }, []);

  const resetArray = () => {
    const n = 100;
    const minVal = 0;
    const maxVal = 500;
    const newArray = Array.from({ length: n }, () => Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
    setArray(newArray);
    setCurrentStep(0);
    setSortingInterval(null);
    setSorting(false); // Reset the sorting state
  };

  const handleAscendingChange = (event) => {
    setAscending(event.target.checked);
  };

  const handleAlgorithmChange = (event) => {
    setAlgorithm(event.target.value);
  };

  const handleSortingSpeedChange = (event) => {
    setSortingSpeed(2000 - parseInt(event.target.value));
  };

  const bubbleSort = () => {
    const copyArray = [...array];
    const steps = [];

    for (let i = 0; i < copyArray.length - 1; i++) {
      for (let j = 0; j < copyArray.length - 1 - i; j++) {
        const num1 = copyArray[j];
        const num2 = copyArray[j + 1];

        if ((num1 > num2 && ascending) || (num1 < num2 && !ascending)) {
          copyArray[j] = num2;
          copyArray[j + 1] = num1;
        }

        steps.push([...copyArray]);
      }
    }

    return steps;
  };

  const insertionSort = () => {
    const copyArray = [...array];
    const steps = [];

    for (let i = 1; i < copyArray.length; i++) {
      const current = copyArray[i];
      let j = i - 1;

      while (j >= 0 && ((copyArray[j] > current && ascending) || (copyArray[j] < current && !ascending))) {
        copyArray[j + 1] = copyArray[j];
        j--;
      }

      copyArray[j + 1] = current;
      steps.push([...copyArray]);
    }

    return steps;
  };

  const mergeSort = () => {
    const copyArray = [...array];
    const steps = [];

    const merge = (arr, left, mid, right) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);

      let i = 0,
        j = 0,
        k = left;

      while (i < leftArr.length && j < rightArr.length) {
        if ((leftArr[i] <= rightArr[j] && ascending) || (leftArr[i] >= rightArr[j] && !ascending)) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        k++;
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        i++;
        k++;
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        j++;
        k++;
      }
    };

    const mergeSortHelper = (arr, left, right) => {
      if (left >= right) return;

      const mid = Math.floor((left + right) / 2);
      mergeSortHelper(arr, left, mid);
      mergeSortHelper(arr, mid + 1, right);
      merge(arr, left, mid, right);
      steps.push([...arr]);
    };

    mergeSortHelper(copyArray, 0, copyArray.length - 1);
    return steps;
  };

  const quickSort = () => {
    const copyArray = [...array];
    const steps = [];

    const partition = (arr, low, high) => {
      const pivot = arr[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if ((arr[j] <= pivot && ascending) || (arr[j] >= pivot && !ascending)) {
          i++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }

      const temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      return i + 1;
    };

    const quickSortHelper = (arr, low, high) => {
      if (low < high) {
        const pi = partition(arr, low, high);
        steps.push([...arr]);

        quickSortHelper(arr, low, pi - 1);
        quickSortHelper(arr, pi + 1, high);
      }
    };

    quickSortHelper(copyArray, 0, copyArray.length - 1);
    return steps;
  };


  const handleSort = () => {
    if (sorting) return; // Prevent starting a new sorting animation if one is already running
    animateSort();
  };

  const animateSort = () => {
    let sortingSteps;

    switch (algorithm) {
      case 'Bubble Sort':
        sortingSteps = bubbleSort();
        break;
      case 'Insertion Sort':
        sortingSteps = insertionSort();
        break;
      case 'Merge Sort':
        sortingSteps = mergeSort();
        break;
      case 'Quick Sort':
        sortingSteps = quickSort();
        break;
      default:
        return;
    }

    let step = 0;
    setSorting(true);

    const interval = setInterval(() => {
      if (step < sortingSteps.length) {
        setArray(sortingSteps[step]);
        setCurrentStep(step);
        step++;
      } else {
        clearInterval(interval);
        setSorting(false);
      }
    }, sortingSpeed);

    setSortingInterval(interval);
  };

  return (
    <div className="sorting-visualizer">
      <div className="visualization">
        {array.map((value, index) => (
          <div
            key={index}
            className="bar"
            style={{
              height: `${(value / 500) * 100}%`,
              backgroundColor: `rgba(0, ${Math.floor((value / 500) * 255)}, 165, 0.9)`,
            }}
          ></div>
        ))}
      </div>
      <div className="controls">
        <button onClick={resetArray} disabled={sorting}>
          Reset
        </button>
        <button onClick={handleSort} disabled={sorting}>
          Start
        </button>
        <label>
          <input type="checkbox" checked={ascending} onChange={handleAscendingChange} />
          Ascending
        </label>
        <select value={algorithm} onChange={handleAlgorithmChange}>
          <option value="Bubble Sort">Bubble Sort</option>
          <option value="Insertion Sort">Insertion Sort</option>
          <option value="Merge Sort">Merge Sort</option>
          <option value="Quick Sort">Quick Sort</option>
        </select>
        <label>
          Sorting Speed:
          <input
            type="range"
            min="1"
            max="1999"
            value={2000 - sortingSpeed}
            onChange={handleSortingSpeedChange}
          />
        </label>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <h1>Sorting Algorithm Visualization</h1>
      <SortingVisualizer />
    </div>
  );
};

export default App;
