const RankingsTable = ({ users }: any) => {
  return (
    <div className="overflow-x-auto relative shadow-custom sm:rounded-lg mt-8">
      <table className="w-full text-sm text-left text-dark">
        <thead className="text-xs text-dark uppercase bg-secondary">
          <tr>
            <th scope="col" className="py-3 px-6">
              Wallet Address
            </th>
            <th scope="col" className="py-3 px-6">
              Ethereum Token
            </th>
            <th scope="col" className="py-3 px-6">
              Token Token
            </th>
            <th scope="col" className="py-3 px-6">
              Net Worth
            </th>
            <th scope="col" className="py-3 px-6">
              Multiplier
            </th>
            <th scope="col" className="py-3 px-6">
              Rank
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length ? users?.map((user: any, index: number) => {
            const { walletAddress, ethValue, tokenValue, multiplier, rank, total } =
              user;
            return (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="py-4 px-6">
                  {`${walletAddress?.slice(0, 6)}.....${walletAddress?.slice(
                    -4
                  )}`}
                </td>
                <td className="py-4 px-6">{ethValue}</td>
                <td className="py-4 px-6">{tokenValue}</td>
                <td className="py-4 px-6">{total}</td>
                <td className="py-4 px-6">{multiplier}</td>
                <td className="py-4 px-6">{rank}</td>
              </tr>
            );
          }) : <> </>}
        </tbody>
      </table>
    </div>
  );
};

export default RankingsTable;
