import React from 'react';
import styled from 'styled-components';

import { TSymbol } from 'v2/types';
import { getSymbolIcon } from 'v2/utils';

const STypography = styled('span')`
  font-size: inherit;
  line-height: 1.5;
  vertical-align: middle;
`;
const SContainer = styled('div')`
  display: inline-flex;
  align-contents: center;
`;
interface Props {
  amount: string;
  symbol: TSymbol;
  decimals?: number;
  icon?: boolean;
  prefix?: boolean;
}

function Currency({ amount, symbol, decimals = 5, icon = false, prefix = false, ...props }: Props) {
  const format = (value: string, decimalPlaces: number) => {
    const v = parseFloat(value);
    return Number(v).toFixed(decimalPlaces);
    // const multiplier = Math.pow(10, decimalPlaces);
    // return Math.round(v * multiplier + Number.EPSILON) / multiplier;
  };

  return (
    <SContainer {...props}>
      {icon && (
        <span>
          <img src={getSymbolIcon(symbol)} width={19} alt={symbol} />
        </span>
      )}
      <STypography>
        {prefix && `${symbol}`}
        {format(amount, decimals)}
        {!prefix && `${symbol}`}
      </STypography>
    </SContainer>
  );
}

export default Currency;
